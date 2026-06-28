import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { getHydrationSafeRates } from "../src/core/lib/hydrationState.ts";

const root = new URL("../", import.meta.url);

test("Header uses server rates until the client store is initialized", async () => {
  const initialRates = { CNY: 1, USD: 0.14 };

  assert.equal(getHydrationSafeRates(null, initialRates), initialRates);
  assert.deepEqual(
    getHydrationSafeRates({ EUR: 0.12 }, initialRates),
    { EUR: 0.12 },
  );

  const header = await readFile(new URL("src/site-package/kellogg/components/Header/index.tsx", root), "utf8");
  assert.match(header, /getHydrationSafeRates\(rates, initialRates\)/);
  assert.match(header, /rates=\{effectiveRates\}/);
  assert.match(header, /effectiveRates \? Object\.keys\(effectiveRates\)/);
});

test("inquiry and Header Chinese copy is readable", async () => {
  const files = await Promise.all([
    readFile(new URL("src/site-package/kellogg/utils/inquiry.ts", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/pages/InquiryView.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/blocks/InquirySection.tsx", root), "utf8"),
    readFile(new URL("src/site-package/kellogg/components/Header/HeaderActions.tsx", root), "utf8"),
  ]);
  const source = files.join("\n");

  for (const copy of [
    "联系我们获取样品",
    "请先完成人机验证",
    "提交询盘",
    "请输入您的姓名",
    "输入国家",
    "输入公司名称",
    "想要的产品",
    "告诉我们您的具体需求",
    "链接已复制到剪贴板",
    "中文",
  ]) {
    assert.match(source, new RegExp(copy));
  }

  assert.doesNotMatch(source, /[鑱鎴璇閭鍥濮鎻杩娑闇鎯鍛]鐨|锛|銆|鈹/);
});
