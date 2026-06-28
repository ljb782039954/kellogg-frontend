import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const blocksDir = path.join(root, "src", "site-package", "kellogg", "components", "blocks");
const rendererPath = path.join(root, "src", "site-package", "kellogg", "pages", "BlockRenderer.astro");
const dynamicRendererPath = path.join(root, "src", "core", "components", "DynamicRenderer.astro");
const blockDataLoaderPath = path.join(root, "src", "site-package", "kellogg", "utils", "loadBlockData.ts");
const blockSchemasDir = path.join(root, "src", "site-package", "kellogg", "block-schemas");
const blockAdaptersDir = path.join(root, "src", "site-package", "kellogg", "block-adapters");
const uiBlocksDir = path.join(root, "src", "site-package", "kellogg", "components", "ui-blocks");

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

test("simple static blocks keep data shaping outside the UI component", async () => {
  const [
    imageBannerTag,
    imageBannerTagView,
    imageBannerTagSchema,
    imageBannerTagAdapter,
    textSection,
    textSectionView,
    textSectionSchema,
    textSectionAdapter,
    ctaBanner,
    ctaBannerView,
    ctaBannerSchema,
    ctaBannerAdapter,
    blockRenderer,
  ] = await Promise.all([
    readFile(path.join(blocksDir, "ImageBannerTag.tsx"), "utf8"),
    readFile(path.join(uiBlocksDir, "ImageBannerTagView.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "imageBannerTag.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "imageBannerTagAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "TextSection.tsx"), "utf8"),
    readFile(path.join(uiBlocksDir, "TextSectionView.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "textSection.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "textSectionAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "CtaBanner.tsx"), "utf8"),
    readFile(path.join(uiBlocksDir, "CtaBannerView.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "ctaBanner.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "ctaBannerAdapter.ts"), "utf8"),
    readFile(rendererPath, "utf8"),
  ]);

  assert.doesNotMatch(imageBannerTag, /@services|services\/api|createTranslate|getOptimizedImageUrl/);
  assert.doesNotMatch(imageBannerTagView, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl/);
  assert.match(imageBannerTagSchema, /interface\s+ImageBannerTagContent/);
  assert.doesNotMatch(imageBannerTagSchema, /components\/ui-blocks|ImageBannerTagView/);
  assert.match(imageBannerTagAdapter, /toImageBannerTagViewProps/);
  assert.match(blockRenderer, /toImageBannerTagViewProps/);

  assert.match(textSection, /toTextSectionViewProps/);
  assert.doesNotMatch(textSectionView, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl/);
  assert.match(textSectionSchema, /interface\s+TextSectionContent/);
  assert.doesNotMatch(textSectionSchema, /components\/ui-blocks|TextSectionView/);
  assert.match(textSectionAdapter, /toTextSectionViewProps/);

  assert.doesNotMatch(ctaBanner, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl/);
  assert.doesNotMatch(ctaBannerView, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl|SectionHeader|OptimizedImage/);
  assert.match(ctaBannerSchema, /interface\s+CtaBannerContent/);
  assert.doesNotMatch(ctaBannerSchema, /components\/ui-blocks|CtaBannerView/);
  assert.match(ctaBannerAdapter, /toCtaBannerViewProps/);
  assert.match(blockRenderer, /toCtaBannerViewProps/);
});

test("business block containers delegate render-only UI to lower-level components", async () => {
  const [productGrid, productGridView, productGridSchema, productGridAdapter] = await Promise.all([
    readFile(path.join(blocksDir, "ProductGrid.tsx"), "utf8"),
    readFile(path.join(uiBlocksDir, "ProductGridView.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "productGrid.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "productGridAdapter.ts"), "utf8"),
  ]);

  assert.match(productGrid, /ProductGridView/);
  assert.match(productGrid, /@services\/api/);
  assert.match(productGrid, /toProductGridItems/);
  assert.doesNotMatch(productGridView, /@services|services\/api|useEffect|useState|\.\.\/\.\.\/types|\.\.\/\.\.\/utils\/i18n|lang/);
  assert.match(productGridSchema, /interface\s+ProductGridContent/);
  assert.doesNotMatch(productGridSchema, /components\/ui-blocks|ProductGridView/);
  assert.match(productGridAdapter, /toProductGridItems/);
});

test("product card static is a pure reusable UI component", async () => {
  const [productCardStatic, productCardContainer, productCardAdapter] = await Promise.all([
    readFile(path.join(root, "src", "site-package", "kellogg", "components", "base", "ProductCardStatic.tsx"), "utf8"),
    readFile(path.join(root, "src", "site-package", "kellogg", "components", "base", "ProductCard.tsx"), "utf8"),
    readFile(path.join(blockAdaptersDir, "productCardAdapter.ts"), "utf8"),
  ]);

  assert.match(productCardStatic, /OptimizedImage/);
  assert.doesNotMatch(productCardStatic, /Product\b|Language\b|Translation\b|createTranslate|\bt\(|formatPrice|@services|useEffect|useState|useStore/);
  assert.match(productCardContainer, /toProductCardStaticProps/);
  assert.match(productCardAdapter, /toProductCardStaticProps/);
  assert.doesNotMatch(productCardAdapter, /getImageUrl|getOptimizedImageUrl/);
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

  assert.match(blockDataLoader, /export\s+async\s+function\s+loadKelloggBlockData/);
  assert.doesNotMatch(blockDataLoader, /\/\/\s*export\s+async\s+function\s+loadKelloggBlockData/);
  assert.doesNotMatch(blockDataLoader, /to(ImageBannerTag|CtaBanner)ViewProps/);
  assert.match(dynamicRenderer, /loadBlockData/);
  assert.match(cmsPage, /loadKelloggBlockData/);
  assert.match(productsPage, /loadKelloggBlockData/);
});
