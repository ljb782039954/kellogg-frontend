# Blocks TSX Migration Design

## Scope

The first migration phase applies only to `webApp-astro`. It converts every
block-level `.astro` component into a local React `.tsx` component. It does not
create a shared package and does not modify `adminApp`.

## Rendering Boundary

- Static display blocks remain server-rendered by Astro without `client:*`.
- Existing interactive blocks keep their current hydration directives.
- React block components receive prepared props and must not access Astro APIs.
- API calls remain in Astro pages, layouts, or `DynamicRenderer.astro`.

## Component Boundary

`DynamicRenderer.astro` remains the block orchestration layer. It loads global
data required by product, category, and customer-review blocks, then passes that
data into TSX components. Shared visual primitives needed by TSX blocks use
React implementations, including `SectionHeader`, `OptimizedImage`, and
`ProductVideo`.

## Migration Set

The following block wrappers or components move to TSX:

- BrandValues
- Categories
- CtaBanner
- CustomerReviews
- FeatureList
- ImageBanner
- ImageBannerTag
- ImageText
- NewArrivals
- PartnerLogos
- Testimonials
- TextSection
- VideoSection
- FeaturedProducts wrapper removal

Existing TSX blocks remain in place. `Gallery.astro` and its unused lightbox
bridge are removed because `DynamicRenderer` already uses `Gallery.tsx`.

## Verification

- A Node architecture test enforces that `components/blocks` contains no
  `.astro` files.
- The test verifies that static blocks are rendered without `client:*`.
- The test verifies that `DynamicRenderer.astro` imports the TSX block modules.
- `npm run build` is used as the integration check; remote API availability is
  reported separately if it prevents prerendering.
