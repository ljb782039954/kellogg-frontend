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

test("pages and site packages use the app API service instead of core API singleton", async () => {
  const scanRoots = [
    path.join(srcDir, "pages"),
    path.join(srcDir, "site-package"),
  ];
  const offenders = [];

  for (const scanRoot of scanRoots) {
    const files = await collectFiles(scanRoot);
    for (const file of files) {
      const source = await readFile(file, "utf8");
      if (source.includes("core/lib/api")) {
        offenders.push(path.relative(root, file));
      }
    }
  }

  assert.deepEqual(offenders, []);
});
