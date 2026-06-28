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
const blockContainersDir = path.join(root, "src", "site-package", "kellogg", "components", "blocks-containers");

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

  assert.match(renderer, /from "\.\.\/components\/blocks"/);
  for (const [component, moduleName] of Object.entries(staticBlocks)) {
    assert.match(renderer, new RegExp(`\\b${component}\\b`), `${component} should be imported from the blocks barrel`);
    assert.doesNotMatch(renderer, new RegExp(`<${component}[^>]+client:`));
  }
});

test("block schemas and adapters are imported through barrel indexes", async () => {
  const [renderer, schemaIndex, adapterIndex] = await Promise.all([
    readFile(rendererPath, "utf8"),
    readFile(path.join(blockSchemasDir, "index.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "index.ts"), "utf8"),
  ]);

  assert.match(renderer, /from "\.\.\/block-adapters"/);
  assert.match(renderer, /from "\.\.\/block-schemas"/);
  assert.match(schemaIndex, /export \* from "\.\/imageBanner"/);
  assert.match(schemaIndex, /export \* from "\.\/gallery"/);
  assert.match(adapterIndex, /export \* from "\.\/imageBannerAdapter"/);
  assert.match(adapterIndex, /export \* from "\.\/galleryAdapter"/);
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
    brandValues,
    brandValuesSchema,
    brandValuesAdapter,
    imageBanner,
    imageBannerSchema,
    imageBannerAdapter,
    imageBannerTag,
    imageBannerTagSchema,
    imageBannerTagAdapter,
    textSection,
    textSectionSchema,
    textSectionAdapter,
    featureList,
    featureListSchema,
    featureListAdapter,
    imageText,
    imageTextSchema,
    imageTextAdapter,
    partnerLogos,
    partnerLogosSchema,
    partnerLogosAdapter,
    testimonials,
    testimonialsSchema,
    testimonialsAdapter,
    videoSection,
    videoSectionSchema,
    videoSectionAdapter,
    ctaBanner,
    ctaBannerSchema,
    ctaBannerAdapter,
    blockRenderer,
  ] = await Promise.all([
    readFile(path.join(blocksDir, "BrandValues.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "brandValues.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "brandValuesAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "ImageBanner.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "imageBanner.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "imageBannerAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "ImageBannerTag.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "imageBannerTag.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "imageBannerTagAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "TextSection.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "textSection.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "textSectionAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "FeatureList.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "featureList.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "featureListAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "ImageText.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "imageText.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "imageTextAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "PartnerLogos.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "partnerLogos.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "partnerLogosAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "Testimonials.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "testimonials.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "testimonialsAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "VideoSection.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "videoSection.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "videoSectionAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "CtaBanner.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "ctaBanner.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "ctaBannerAdapter.ts"), "utf8"),
    readFile(rendererPath, "utf8"),
  ]);

  for (const source of [brandValues, featureList, imageBanner, imageText, partnerLogos, testimonials, videoSection]) {
    assert.doesNotMatch(source, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl|lang/);
  }
  assert.match(brandValuesSchema, /interface\s+BrandValuesContent/);
  assert.match(brandValuesAdapter, /toBrandValuesViewProps/);
  assert.match(blockRenderer, /toBrandValuesViewProps/);
  assert.match(imageBannerSchema, /interface\s+ImageBannerContent/);
  assert.match(imageBannerAdapter, /toImageBannerViewProps/);
  assert.match(blockRenderer, /toImageBannerViewProps/);
  assert.match(featureListSchema, /interface\s+FeatureListContent/);
  assert.match(featureListAdapter, /toFeatureListViewProps/);
  assert.match(blockRenderer, /toFeatureListViewProps/);
  assert.match(imageTextSchema, /interface\s+ImageTextContent/);
  assert.match(imageTextAdapter, /toImageTextViewProps/);
  assert.match(blockRenderer, /toImageTextViewProps/);
  assert.match(partnerLogosSchema, /interface\s+PartnerLogosContent/);
  assert.match(partnerLogosAdapter, /toPartnerLogosViewProps/);
  assert.match(blockRenderer, /toPartnerLogosViewProps/);
  assert.match(testimonialsSchema, /interface\s+TestimonialsContent/);
  assert.match(testimonialsAdapter, /toTestimonialsViewProps/);
  assert.match(blockRenderer, /toTestimonialsViewProps/);
  assert.match(videoSectionSchema, /interface\s+VideoSectionContent/);
  assert.match(videoSectionAdapter, /toVideoSectionViewProps/);
  assert.match(blockRenderer, /toVideoSectionViewProps/);

  assert.doesNotMatch(imageBannerTag, /@services|services\/api|createTranslate|getOptimizedImageUrl/);
  assert.match(imageBannerTagSchema, /interface\s+ImageBannerTagContent/);
  assert.doesNotMatch(imageBannerTagSchema, /components\/blocks/);
  assert.match(imageBannerTagAdapter, /toImageBannerTagViewProps/);
  assert.match(blockRenderer, /toImageBannerTagViewProps/);

  assert.doesNotMatch(textSection, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl|toTextSectionViewProps/);
  assert.match(textSectionSchema, /interface\s+TextSectionContent/);
  assert.doesNotMatch(textSectionSchema, /components\/blocks/);
  assert.match(textSectionAdapter, /toTextSectionViewProps/);
  assert.match(blockRenderer, /toTextSectionViewProps/);

  assert.doesNotMatch(ctaBanner, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl/);
  assert.match(ctaBannerSchema, /interface\s+CtaBannerContent/);
  assert.doesNotMatch(ctaBannerSchema, /components\/blocks/);
  assert.match(ctaBannerAdapter, /toCtaBannerViewProps/);
  assert.match(blockRenderer, /toCtaBannerViewProps/);
});

test("interactive media blocks keep translations outside UI state components", async () => {
  const [
    faq,
    faqSchema,
    faqAdapter,
    gallery,
    gallerySchema,
    galleryAdapter,
    imageFull,
    imageFullSchema,
    imageFullAdapter,
    blockRenderer,
  ] = await Promise.all([
    readFile(path.join(blocksDir, "FAQ.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "faq.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "faqAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "Gallery.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "gallery.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "galleryAdapter.ts"), "utf8"),
    readFile(path.join(blocksDir, "ImageFull.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "imageFull.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "imageFullAdapter.ts"), "utf8"),
    readFile(rendererPath, "utf8"),
  ]);

  for (const source of [faq, gallery, imageFull]) {
    assert.match(source, /useState/);
    assert.doesNotMatch(source, /Translation|createTranslate|@services|services\/api|getOptimizedImageUrl|lang\s*===|lang:/);
  }

  assert.match(faq, /structuredData/);
  assert.match(faqSchema, /interface\s+FAQContent/);
  assert.match(faqAdapter, /toFAQViewProps/);
  assert.match(blockRenderer, /toFAQViewProps/);
  assert.match(gallery, /role="dialog"/);
  assert.match(gallerySchema, /interface\s+GalleryContent/);
  assert.match(galleryAdapter, /toGalleryViewProps/);
  assert.match(blockRenderer, /toGalleryViewProps/);
  assert.match(imageFull, /role="dialog"/);
  assert.match(imageFullSchema, /interface\s+ImageFullContent/);
  assert.match(imageFullAdapter, /toImageFullViewProps/);
  assert.match(blockRenderer, /toImageFullViewProps/);
});

test("business block containers delegate render-only UI to lower-level components", async () => {
  const [
    productGridContainer,
    productGridUi,
    productGridSchema,
    productGridAdapter,
    featuredProductsContainer,
    featuredProductsUi,
    featuredProductsSchema,
    featuredProductsAdapter,
    newArrivalsContainer,
    newArrivalsUi,
    newArrivalsSchema,
    newArrivalsAdapter,
    inquiryContainer,
    inquiryUi,
    blockRenderer,
  ] = await Promise.all([
    readFile(path.join(blockContainersDir, "ProductGridContainer.tsx"), "utf8"),
    readFile(path.join(blocksDir, "ProductGrid.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "productGrid.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "productGridAdapter.ts"), "utf8"),
    readFile(path.join(blockContainersDir, "FeaturedProductsContainer.tsx"), "utf8"),
    readFile(path.join(blocksDir, "FeaturedProducts.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "featuredProducts.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "featuredProductsAdapter.ts"), "utf8"),
    readFile(path.join(blockContainersDir, "NewArrivalsContainer.tsx"), "utf8"),
    readFile(path.join(blocksDir, "NewArrivals.tsx"), "utf8"),
    readFile(path.join(blockSchemasDir, "newArrivals.ts"), "utf8"),
    readFile(path.join(blockAdaptersDir, "newArrivalsAdapter.ts"), "utf8"),
    readFile(path.join(blockContainersDir, "InquirySectionContainer.tsx"), "utf8"),
    readFile(path.join(blocksDir, "InquirySection.tsx"), "utf8"),
    readFile(rendererPath, "utf8"),
  ]);

  assert.match(blockRenderer, /from "\.\.\/components\/blocks-containers"/);
  assert.match(blockRenderer, /ProductGrid as ProductGridContainer/);
  assert.match(productGridContainer, /ProductGridView/);
  assert.match(productGridContainer, /@services\/api/);
  assert.match(productGridContainer, /toProductGridViewProps/);
  assert.doesNotMatch(productGridUi, /@services|services\/api|useEffect|useState|\.\.\/\.\.\/types|\.\.\/\.\.\/utils\/i18n|lang/);
  assert.match(productGridSchema, /interface\s+ProductGridContent/);
  assert.doesNotMatch(productGridSchema, /components\/blocks/);
  assert.match(productGridAdapter, /toProductGridViewProps/);
  assert.match(productGridAdapter, /toProductGridQuery/);

  assert.match(blockRenderer, /FeaturedProducts/);
  assert.match(featuredProductsContainer, /toFeaturedProductsViewProps/);
  assert.match(featuredProductsContainer, /formatPrice/);
  assert.doesNotMatch(featuredProductsUi, /Translation|createTranslate|formatPrice|toProductCardStaticProps|\.\.\/\.\.\/types|lang/);
  assert.match(featuredProductsSchema, /interface\s+FeaturedProductsContent/);
  assert.match(featuredProductsAdapter, /toFeaturedProductsViewProps/);

  assert.match(blockRenderer, /NewArrivals/);
  assert.match(newArrivalsContainer, /toNewArrivalsViewProps/);
  assert.match(newArrivalsContainer, /formatPrice/);
  assert.doesNotMatch(newArrivalsUi, /Translation|createTranslate|formatPrice|toProductCardStaticProps|\.\.\/\.\.\/types|lang/);
  assert.match(newArrivalsSchema, /interface\s+NewArrivalsContent/);
  assert.match(newArrivalsAdapter, /toNewArrivalsViewProps/);

  assert.match(blockRenderer, /InquirySection/);
  assert.match(inquiryContainer, /useInquiry/);
  assert.match(inquiryContainer, /@services\/api/);
  assert.match(inquiryContainer, /kelloggSiteConfig/);
  assert.match(inquiryContainer, /getKelloggInquiryTranslations/);
  assert.doesNotMatch(inquiryUi, /useInquiry|@services|services\/api|kelloggSiteConfig|getKelloggInquiryTranslations/);
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
