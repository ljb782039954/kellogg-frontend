import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("inquiry forms render Turnstile with the expected action", async () => {
  const [widget, baseForm, blockForm, blockContainer, pageForm, formContainer] = await Promise.all([
    readFile(new URL("src/runtime/components/TurnstileWidget.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/inquiry/InquiryForm.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/inquiry/InquirySection.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/blocks-containers/InquirySectionContainer.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/pages/inquiry/InquiryPageView.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/inquiry/InquiryFormContainer.tsx", root), "utf8"),
  ]);

  assert.match(widget, /data-action="turnstile-spin-v1"/);
  assert.match(widget, /action:\s*["']turnstile-spin-v1["']/);
  assert.doesNotMatch(widget, /0x4AAAAAADlOjyIsNJkg69Te/);
  assert.match(baseForm, /<TurnstileWidget/);
  assert.match(baseForm, /siteKey=\{turnstileSiteKey\}/);
  assert.match(baseForm, /useTestSiteKey=\{useTurnstileTestSiteKey\}/);
  assert.match(blockForm, /<InquiryFormContainer/);
  assert.match(blockContainer, /<InquirySection/);
  assert.match(formContainer, /turnstileSiteKey=\{kelloggSiteConfig\.turnstile\?\.siteKey\}/);
  assert.match(formContainer, /useTurnstileTestSiteKey=\{kelloggSiteConfig\.turnstile\?\.useTestSiteKey\}/);
  assert.match(pageForm, /<InquiryFormContainer/);
});

test("useInquiry submits a token and prevents duplicate submissions", async () => {
  const [hook, baseForm, blockForm, blockContainer, pageForm, siteInquiry] = await Promise.all([
    readFile(new URL("src/core-webApp/hooks/useInquiry.ts", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/inquiry/InquiryForm.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/inquiry/InquirySection.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/blocks-containers/InquirySectionContainer.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/pages/inquiry/InquiryPageView.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/utils/inquiry.ts", root), "utf8"),
  ]);

  assert.match(hook, /turnstileToken/);
  assert.match(hook, /if\s*\(isSubmitting\)/);
  assert.match(hook, /options\.submitInquiry\(\{[\s\S]*turnstileToken/);
  assert.doesNotMatch(hook, /联系我们获取样品|提交询盘|感谢您的咨询/);
  assert.match(siteInquiry, /联系我们获取样品/);
  assert.doesNotMatch(baseForm, /useInquiry|api\.submitInquiry|kelloggSiteConfig|getKelloggInquiryTranslations/);
  assert.doesNotMatch(blockForm, /useInquiry|api\.submitInquiry|kelloggSiteConfig|getKelloggInquiryTranslations/);
  assert.doesNotMatch(blockContainer, /getKelloggInquiryTranslations\(lang\)/);
  assert.doesNotMatch(pageForm, /getKelloggInquiryTranslations\(lang\)/);
});
