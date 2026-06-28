import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const blocksDir = path.join(root, "src", "site-package", "kellogg", "components", "blocks");
const rendererPath = path.join(root, "src", "site-package", "kellogg", "pages", "BlockRenderer.astro");
const dynamicRendererPath = path.join(root, "src", "core", "components", "DynamicRenderer.astro");
const blockDataLoaderPath = path.join(root, "src", "site-package", "kellogg", "utils", "loadBlockData.ts");

test("block components no longer use Astro component files", async () => {
  const files = await readdir(blocksDir);
  const astroFiles = files.filter((file) => file.endsWith(".astro"));

  assert.deepEqual(astroFiles, []);
});

test("static TSX blocks are rendered without hydration directives", async () => {
  const renderer = await readFile(rendererPath, "utf8");
  const staticBlocks = {
    ImageBanner: "ImageBanner",
    TextSection: "TextSection",
    Categories: "Categories",
    FeaturedProducts: "FeaturedProducts",
    NewArrivals: "NewArrivals",
    BrandValues: "BrandValues",
    Testimonials: "Testimonials",
    ImageText: "ImageText",
    CtaBanner: "CtaBanner",
    FeatureList: "FeatureList",
    ImageBannerTag: "ImageBannerTag",
    PartnerLogos: "PartnerLogos",
    VideoSection: "VideoSection",
    CustomerReviews: "CustomerReviews",
  };

  for (const [component, moduleName] of Object.entries(staticBlocks)) {
    assert.match(renderer, new RegExp(`import ${component} from [^;]+/${moduleName}`));
    assert.doesNotMatch(renderer, new RegExp(`<${component}[^>]+client:`));
  }
});

test("static block entry points do not use client hooks or animation runtimes", async () => {
  const staticFiles = [
    "BrandValues.tsx",
    "Categories.tsx",
    "CtaBanner.tsx",
    "CustomerReviews.tsx",
    "FeaturedProducts.tsx",
    "FeatureList.tsx",
    "ImageBanner.tsx",
    "ImageBannerTag.tsx",
    "ImageText.tsx",
    "NewArrivals.tsx",
    "PartnerLogos.tsx",
    "Testimonials.tsx",
    "TextSection.tsx",
    "VideoSection.tsx",
  ];

  for (const file of staticFiles) {
    const source = await readFile(path.join(blocksDir, file), "utf8");
    assert.doesNotMatch(source, /use(State|Effect|Store|Reducer|LayoutEffect)/);
    assert.doesNotMatch(source, /framer-motion|@nanostores\/react/);
  }
});

test("block data loading lives in the site package instead of DynamicRenderer", async () => {
  const [dynamicRenderer, blockDataLoader, cmsPage, productsPage] = await Promise.all([
    readFile(dynamicRendererPath, "utf8"),
    readFile(blockDataLoaderPath, "utf8"),
    readFile(path.join(root, "src", "site-package", "kellogg", "pages", "CmsPage.astro"), "utf8"),
    readFile(path.join(root, "src", "site-package", "kellogg", "pages", "ProductsPage.astro"), "utf8"),
  ]);

  for (const blockType of ["productGrid", "featuredProducts", "newArrivals", "caseStudies"]) {
    assert.doesNotMatch(dynamicRenderer, new RegExp(blockType));
    assert.match(blockDataLoader, new RegExp(blockType));
  }

  assert.match(dynamicRenderer, /loadBlockData/);
  assert.match(cmsPage, /loadKelloggBlockData/);
  assert.match(productsPage, /loadKelloggBlockData/);
});
