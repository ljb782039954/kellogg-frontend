import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeCmsHtml } from "../src/lib/contentSecurity.ts";
import { getSafeVideoSource } from "../src/lib/video.ts";
import { readFile } from "node:fs/promises";

test("sanitizeCmsHtml removes executable markup and unsafe URLs", () => {
  const html = sanitizeCmsHtml(`
    <p onclick="alert(1)">Hello <strong>world</strong></p>
    <script>alert(1)</script>
    <img src="x" onerror="alert(1)">
    <a href="javascript:alert(1)" target="_blank">bad</a>
    <a href="https://example.com" target="_blank">good</a>
  `);

  assert.match(html, /<strong>world<\/strong>/);
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /onclick|onerror|javascript:/i);
  assert.match(html, /rel="noopener noreferrer"/);
});

test("getSafeVideoSource only embeds approved providers", () => {
  assert.deepEqual(
    getSafeVideoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    {
      kind: "embed",
      provider: "youtube",
      url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0",
    },
  );

  assert.equal(getSafeVideoSource("https://evil.example/embed/video"), null);
  assert.equal(getSafeVideoSource("javascript:alert(1)"), null);
});

test("getSafeVideoSource permits direct video only from the configured assets host", () => {
  const source = getSafeVideoSource(
    "https://assets.kelloggfashion.com/uploads/demo.mp4",
    "https://assets.kelloggfashion.com",
  );

  assert.deepEqual(source, {
    kind: "video",
    provider: "direct",
    url: "https://assets.kelloggfashion.com/uploads/demo.mp4",
  });
  assert.equal(
    getSafeVideoSource("https://cdn.example.com/demo.mp4", "https://assets.kelloggfashion.com"),
    null,
  );
});

test("Astro middleware applies baseline browser security headers", async () => {
  const middleware = await readFile(new URL("../src/middleware.ts", import.meta.url), "utf8");
  assert.match(middleware, /Content-Security-Policy/);
  assert.match(middleware, /X-Content-Type-Options/);
  assert.match(middleware, /frame-ancestors 'self'/);
});
