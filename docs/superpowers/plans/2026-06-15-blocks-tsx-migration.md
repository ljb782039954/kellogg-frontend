# Blocks TSX Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all `webApp-astro` block display components from Astro files to local TSX while preserving server-only rendering for non-interactive blocks.

**Architecture:** `DynamicRenderer.astro` remains the data-loading and orchestration boundary. React block components become prop-only display units; static components are rendered by Astro without hydration directives, while existing interactive components retain hydration.

**Tech Stack:** Astro 6, React 19, TypeScript, Tailwind CSS 4, Node test runner

---

### Task 1: Add migration architecture tests

**Files:**
- Create: `tests/blocks-migration.test.mjs`
- Modify: `package.json`

- [ ] Add tests for zero `.astro` files under `src/components/blocks`.
- [ ] Add tests for TSX imports and static hydration rules in `DynamicRenderer.astro`.
- [ ] Run `npm.cmd run test:architecture` and confirm it fails before migration.

### Task 2: Add React display primitives

**Files:**
- Create: `src/components/SectionHeader.tsx`
- Create: `src/components/ProductVideo.tsx`

- [ ] Port SectionHeader markup and rich-text rendering to React.
- [ ] Port ProductVideo platform rendering to React without client hooks.
- [ ] Keep both components compatible with Astro server rendering.

### Task 3: Convert static content blocks

**Files:**
- Replace `.astro` files with matching `.tsx` files for BrandValues, Categories,
  CtaBanner, FeatureList, ImageBanner, ImageBannerTag, ImageText, PartnerLogos,
  Testimonials, TextSection, and VideoSection.

- [ ] Preserve public prop names and output structure.
- [ ] Use React `className`, style objects, and existing React image primitive.
- [ ] Do not add hooks or hydration directives.

### Task 4: Convert data-backed blocks

**Files:**
- Create: `src/components/blocks/NewArrivals.tsx`
- Create: `src/components/blocks/CustomerReviews.tsx`
- Modify: `src/components/blocks/FeaturedProducts.tsx`
- Modify: `src/functions/DynamicRenderer.astro`

- [ ] Move review API loading into `DynamicRenderer.astro`.
- [ ] Make CustomerReviews a prop-only React component.
- [ ] Render NewArrivals and FeaturedProducts without hydration.
- [ ] Remove the redundant FeaturedProducts Astro wrapper.

### Task 5: Remove obsolete Astro block files and verify

**Files:**
- Delete all migrated block `.astro` files.
- Delete unused `Gallery.astro` and `GalleryLightbox.tsx` bridge.
- Modify direct page imports where required.

- [ ] Run `npm.cmd run test:architecture` and confirm all tests pass.
- [ ] Run `npm.cmd run build` and inspect the complete result.
- [ ] Confirm the generated client assets do not contain new static-block islands.
