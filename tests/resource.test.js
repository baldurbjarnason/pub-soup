import { asResource } from "../dist/lib/resource.js";
import tap from "tap";

tap.test("invalid resource", async (test) => {
  test.throws(() => {
    const resource = asResource({
      type: "LinkedResource",
      rel: "cover",
      encodingFormat: "image/jpeg",
    });
    return resource;
  });
});

tap.test("not attachment resource", async (test) => {
  const resource = asResource({
    type: "LinkedResource",
    rel: "cover",
    url: "test.jpeg",
    encodingFormat: "image/jpeg",
  });
  test.notOk(resource.attachment());
});

tap.test("attachment resource", async (test) => {
  const resource = asResource({
    type: "LinkedResource",
    url: "test.txt",
    encodingFormat: "text/plain",
  });
  test.ok(resource.attachment());
});
