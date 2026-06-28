import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "src");

async function collectFiles(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, files);
    } else if (/\.(astro|ts|tsx|js|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function readProjectFile(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

test("current site registry is the only site-package selection entry", async () => {
  const registry = await readProjectFile("src/site-package/index.ts");
  const kelloggConfig = await readProjectFile("src/site-package/kellogg/config.ts");

  assert.match(registry, /PUBLIC_SITE_NAME/);
  assert.match(registry, /kelloggSiteConfig/);
  assert.match(kelloggConfig, /name:\s*"kellogg"/);
  assert.match(kelloggConfig, /languages:\s*\["zh",\s*"en"\]/);
  assert.match(kelloggConfig, /defaultLanguage:\s*"en"/);
});

test("app SiteService connects currentSite to the core service factory", async () => {
  const appService = await readProjectFile("src/services/siteService.ts");
  const coreService = await readProjectFile("src/core/services/siteService.ts");

  assert.match(appService, /currentSite/);
  assert.match(appService, /createSiteService/);
  assert.doesNotMatch(coreService, /site-package/);
  assert.doesNotMatch(coreService, /SUPPORTED_LANGUAGES|DEFAULT_LANGUAGE/);
});

test("core does not gain new site-package imports outside known migration debt", async () => {
  const files = await collectFiles(path.join(srcDir, "core"));
  const offenders = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (source.includes("site-package/")) {
      offenders.push(path.relative(root, file));
    }
  }

  assert.deepEqual(offenders, []);
});

test("core does not read build-time public environment directly", async () => {
  const files = await collectFiles(path.join(srcDir, "core"));
  const offenders = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (/import\.meta\.env|PUBLIC_/.test(source)) {
      offenders.push(path.relative(root, file));
    }
  }

  assert.deepEqual(offenders, []);
});

test("core types do not own site content or catalog models", async () => {
  const coreTypes = await readProjectFile("src/core/types.ts");

  assert.doesNotMatch(coreTypes, /interface\s+(CompanyInfo|HeaderContent|FooterContent|BlogSummary|Blog|Product|Category|BulkPrice)\b/);
  assert.match(coreTypes, /type\s+SiteResource\s*=/);
  assert.match(coreTypes, /companyInfo:\s*SiteResource/);
  assert.match(coreTypes, /header:\s*SiteResource/);
  assert.match(coreTypes, /footer:\s*SiteResource/);
});

test("site layout composes the core layout shell", async () => {
  const coreLayout = await readProjectFile("src/core/layouts/CoreLayout.astro");
  const siteLayout = await readProjectFile("src/site-package/kellogg/layouts/SiteLayout.astro");

  assert.match(coreLayout, /<!doctype html>/);
  assert.match(coreLayout, /<slot\s*\/>/);
  assert.doesNotMatch(coreLayout, /site-package|kellogg/i);
  assert.match(siteLayout, /CoreLayout/);
  assert.doesNotMatch(siteLayout, /<!doctype html>/);
});

test("pages and site packages use the app API service for runtime API access outside API adapters", async () => {
  const scanRoots = [
    path.join(srcDir, "pages"),
    path.join(srcDir, "site-package"),
  ];
  const allowedRuntimeCoreApiImports = new Set([
    path.normalize(path.join("src", "site-package", "kellogg", "utils", "api.ts")),
  ]);
  const offenders = [];

  for (const scanRoot of scanRoots) {
    const files = await collectFiles(scanRoot);
    for (const file of files) {
      const source = await readFile(file, "utf8");
      const hasRuntimeCoreApiImport = source
        .split(/\r?\n/)
        .some((line) => line.includes("core/lib/api") && !/^\s*import\s+type\b/.test(line));
      const relativePath = path.normalize(path.relative(root, file));
      if (hasRuntimeCoreApiImport && !allowedRuntimeCoreApiImports.has(relativePath)) {
        offenders.push(relativePath);
      }
    }
  }

  assert.deepEqual(offenders, []);
});

test("core API requester does not own site endpoint methods", async () => {
  const coreApi = await readProjectFile("src/core/lib/api.ts");
  const kelloggApi = await readProjectFile("src/site-package/kellogg/utils/api.ts");

  for (const endpoint of ["/api/products", "/api/categories", "/api/blogs", "/api/reviews", "/api/inquiries/submit"]) {
    assert.doesNotMatch(coreApi, new RegExp(endpoint.replace(/\//g, "\\/")));
    assert.match(kelloggApi, new RegExp(endpoint.replace(/\//g, "\\/")));
  }

  assert.doesNotMatch(coreApi, /\b(getProducts|getProduct|getCategories|getBlogs|getBlog|getReviews|submitInquiry)\b/);
  assert.match(coreApi, /createApiRequester/);
});

test("new site-package Astro files stay under pages except current compatibility debt", async () => {
  const allowedOutsidePages = new Set([
    path.normalize(path.join("src", "site-package", "kellogg", "components", "Footer.astro")),
    path.normalize(path.join("src", "site-package", "kellogg", "components", "SocialLinks.astro")),
    path.normalize(path.join("src", "site-package", "kellogg", "components", "TawkChat.astro")),
    path.normalize(path.join("src", "site-package", "kellogg", "components", "product", "ProductCustomFields.astro")),
    path.normalize(path.join("src", "site-package", "kellogg", "layouts", "SiteLayout.astro")),
  ]);
  const files = await collectFiles(path.join(srcDir, "site-package", "kellogg"));
  const offenders = files
    .filter((file) => file.endsWith(".astro"))
    .map((file) => path.normalize(path.relative(root, file)))
    .filter((relativePath) => !relativePath.includes(path.normalize(`${path.sep}pages${path.sep}`)))
    .filter((relativePath) => !allowedOutsidePages.has(relativePath));

  assert.deepEqual(offenders, []);
});

test("tests do not reference retired pre-refactor source paths", async () => {
  const files = await collectFiles(path.join(root, "tests"));
  const retiredPathPattern = /src\/(?:components|functions|lib|hooks)|src\\(?:components|functions|lib|hooks)/;
  const offenders = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (retiredPathPattern.test(source)) {
      offenders.push(path.relative(root, file));
    }
  }

  assert.deepEqual(offenders, []);
});
