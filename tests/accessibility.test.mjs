import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("interactive media blocks expose dialog and keyboard semantics", async () => {
  const [gallery, imageFull, carousel] = await Promise.all([
    readFile(new URL("src/site-package/kellogg/components/blocks/Gallery.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/blocks/ImageFull.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/blocks/Carousel.tsx", root), "utf8"),
  ]);

  for (const source of [gallery, imageFull]) {
    assert.match(source, /role="dialog"/);
    assert.match(source, /aria-modal="true"/);
    assert.match(source, /Escape/);
  }
  assert.match(carousel, /aria-roledescription="carousel"/);
  assert.match(carousel, /aria-label=/);
});

test("unknown blocks do not expose raw CMS data in production", async () => {
  const renderer = await readFile(new URL("src/site-package/kellogg/pages/BlockRenderer.astro", root), "utf8");
  assert.match(renderer, /import\.meta\.env\.DEV/);
});
