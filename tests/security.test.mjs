import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeCmsHtml } from "../src/core/lib/contentSecurity.ts";
import { buildContentSecurityPolicy } from "../src/core/lib/csp.ts";
import { getSafeVideoSource } from "../src/core/lib/video.ts";
import { readFile } from "node:fs/promises";

test("sanitizeCmsHtml removes executable markup and unsafe URLs", () => {
  const html = sanitizeCmsHtml(`
    <p onclick="alert(1)">Hello <strong>world</strong></p>
    <script>alert(1)</script>
    <style>body { display: none }</style>
    <img src="x" onerror="alert(1)">
    <img src="data:text/html,danger">
    <a href="javascript:alert(1)" target="_blank">bad</a>
    <a href="https://example.com" target="_blank">good</a>
  `);

  assert.match(html, /<strong>world<\/strong>/);
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<style|display: none|onclick|onerror|javascript:|data:text/i);
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

test("getSafeVideoSource honors configured video providers", () => {
  assert.equal(
    getSafeVideoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
      providers: ["vimeo"],
    }),
    null,
  );

  assert.deepEqual(
    getSafeVideoSource("https://assets.kelloggfashion.com/uploads/demo.mp4", {
      assetsBase: "https://assets.kelloggfashion.com",
      providers: ["direct"],
    }),
    {
      kind: "video",
      provider: "direct",
      url: "https://assets.kelloggfashion.com/uploads/demo.mp4",
    },
  );
});

test("Astro middleware applies baseline browser security headers", async () => {
  const middleware = await readFile(new URL("../src/middleware.ts", import.meta.url), "utf8");
  assert.match(middleware, /Content-Security-Policy/);
  assert.match(middleware, /X-Content-Type-Options/);
  assert.match(middleware, /buildContentSecurityPolicy\(currentSite\)/);
  assert.doesNotMatch(middleware, /tawk\\.to|youtube-nocookie|player\\.vimeo/);
});

test("buildContentSecurityPolicy combines core defaults with site extras", () => {
  const policy = buildContentSecurityPolicy({
    security: {
      csp: {
        scriptSrc: ["https://example-script.test"],
        frameSrc: ["https://example-frame.test"],
        connectSrc: ["https://example-connect.test"],
      },
    },
  });

  assert.match(policy, /default-src 'self'/);
  assert.match(policy, /frame-ancestors 'self'/);
  assert.ok(policy.includes("script-src 'self' 'unsafe-inline' https://example-script.test"));
  assert.ok(policy.includes("frame-src 'self' https://example-frame.test"));
  assert.ok(policy.includes("connect-src 'self' https: wss: https://example-connect.test"));
});
