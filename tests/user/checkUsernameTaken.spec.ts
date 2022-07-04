import assert from "assert";
import { checkUsernameTaken } from "~/utils/permission/user";

describe("checkUsernameTaken", () => {
  it("已经被占用则返回 true", async () => {
    assert(await checkUsernameTaken("Alice"));
    assert(await checkUsernameTaken("Bob"));
    assert(await checkUsernameTaken("Cherry"));
    assert(await checkUsernameTaken("David"));
  });

  it("没有被占用则返回 false", async () => {
    assert(!(await checkUsernameTaken("Eden")));
    assert(!(await checkUsernameTaken("Frank")));
  });
});
