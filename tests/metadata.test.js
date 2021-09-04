import { embed } from "../dist/lib/metadata.js";
import tap from "tap";

tap.test("metadata embed", async (test) => {
  const _metadata = {
    type: ["Book"],
    resources: [{ url: "file.html" }],
    readingOrder: [{ url: "file.html" }],
  };
  const archive = { _metadata };
  const result = embed(archive);
  test.equal(result.resources[0].url, "#idZmlsZS5odG1s");
  test.equal(result.url, "index.html");
  test.equal(result.resources[0].url, "#idZmlsZS5odG1s");
});
