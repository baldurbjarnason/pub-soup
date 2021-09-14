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
