import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  escapeXml,
  joinSiteUrl,
  renderSitemapXml,
} from "../src/cms/lib/sitemap.ts";

const root = new URL("../", import.meta.url);

test("sitemap helpers normalize URLs and escape XML text", () => {
  assert.equal(joinSiteUrl("https://example.com/", "products"), "https://example.com/products");
  assert.equal(joinSiteUrl("https://example.com", "/products"), "https://example.com/products");
  assert.equal(escapeXml(`A&B<"'>`), "A&amp;B&lt;&quot;&apos;&gt;");
});

test("renderSitemapXml emits URL and optional image entries", () => {
  const xml = renderSitemapXml([
    {
      loc: "https://example.com/product/1?a=1&b=2",
      lastmod: "2026-01-01T00:00:00.000Z",
      changefreq: "weekly",
      priority: "0.8",
      image: {
        loc: "https://example.com/image.jpg",
        title: "Demo Product",
      },
    },
  ]);

  assert.match(xml, /<urlset/);
  assert.match(xml, /https:\/\/example\.com\/product\/1\?a=1&amp;b=2/);
  assert.match(xml, /<image:image>/);
  assert.match(xml, /<!\[CDATA\[Demo Product\]\]>/);
});

test("sitemap route gates dynamic URLs by current site page capabilities", async () => {
  const source = await readFile(new URL("src/pages/sitemap.xml.ts", root), "utf8");

  assert.match(source, /supportsProductDetails\s*=\s*Boolean\(siteConfig\.pages\?\.productDetail\)/);
  assert.match(source, /supportsBlogDetails\s*=\s*Boolean\(siteConfig\.pages\?\.blogDetail\)/);
  assert.match(source, /supportsProductDetails\s*\?\s*api\.getProducts/);
  assert.match(source, /if\s*\(supportsBlogDetails\)\s*try/);
  assert.match(source, /fixedPageCapabilities/);
});
