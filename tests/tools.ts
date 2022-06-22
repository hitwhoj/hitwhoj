import assert from "assert";

export async function rejects<T>(promise: Promise<T>) {
  try {
    await promise;
  } catch (e) {
    return;
  }
  assert.fail("should reject");
}

export async function resolves<T>(promise: Promise<T>) {
  try {
    await promise;
  } catch (e) {
    assert.fail("should resolve");
  }
}
