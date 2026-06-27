import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("inquiry forms render Turnstile with the expected action", async () => {
  const [widget, blockForm, pageForm] = await Promise.all([
    readFile(new URL("src/components/TurnstileWidget.tsx", root), "utf8"),
    readFile(new URL("src/components/blocks/InquirySection.tsx", root), "utf8"),
    readFile(new URL("src/components/pages/InquiryView.tsx", root), "utf8"),
  ]);

  assert.match(widget, /data-action="turnstile-spin-v1"/);
  assert.match(widget, /action:\s*["']turnstile-spin-v1["']/);
  assert.match(widget, /0x4AAAAAADlOjyIsNJkg69Te/);
  assert.match(blockForm, /<TurnstileWidget/);
  assert.match(pageForm, /<TurnstileWidget/);
});

test("useInquiry submits a token and prevents duplicate submissions", async () => {
  const hook = await readFile(new URL("src/hooks/useInquiry.ts", root), "utf8");

  assert.match(hook, /turnstileToken/);
  assert.match(hook, /if\s*\(isSubmitting\)/);
  assert.match(hook, /api\.submitInquiry\(\{[\s\S]*turnstileToken/);
});
