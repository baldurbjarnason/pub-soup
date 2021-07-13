import { Names } from "../src/names.js";
import tap from "tap";

tap.test("names", async (test) => {
  const names = new Names();
  test.equal(names.get("test"), "_id");
});

tap.test("names - id", async (test) => {
  let counter = 0;
  function id() {
    counter = counter + 1;
    return counter + "_id";
  }
  const names = new Names(id);
  test.equal(names.get("test"), "1_id");
  test.equal(names.get("test"), "1_id");
  test.equal(names.get("test2"), "2_id");
});
