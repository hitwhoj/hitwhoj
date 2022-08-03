import test from "node:test";
import assert from "node:assert";

test("Math test", () => {
  let a = 0.1;
  let b = 0.2;

  assert(a + b !== 0.3, "0.1 + 0.2 !== 0.3");
});
