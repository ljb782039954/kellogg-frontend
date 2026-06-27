import test from "node:test";
import assert from "node:assert/strict";

import { createRequestMemo } from "../src/core/lib/requestMemo.ts";

test("createRequestMemo reuses an in-flight request with the same key", async () => {
  const memo = createRequestMemo();
  let calls = 0;
  const loader = async () => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 5));
    return { value: 42 };
  };

  const [first, second] = await Promise.all([
    memo.get("same", loader),
    memo.get("same", loader),
  ]);

  assert.equal(calls, 1);
  assert.equal(first, second);
});

test("createRequestMemo removes rejected requests so they can be retried", async () => {
  const memo = createRequestMemo();
  let calls = 0;
  const loader = async () => {
    calls += 1;
    if (calls === 1) throw new Error("temporary");
    return "ok";
  };

  await assert.rejects(memo.get("retry", loader), /temporary/);
  assert.equal(await memo.get("retry", loader), "ok");
  assert.equal(calls, 2);
});
