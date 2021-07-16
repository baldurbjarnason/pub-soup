import { embed, toJSON } from "../src/metadata.js";
import { Base, Names } from "../src/zip/index.js";
import tap from "tap";

tap.test("metadata toJSON", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const base = new Base(
    {
      base: "http://test.example.com/",
      media: "http://media.example.com/",
      link: "http://link.example.com/",
      style: "http://style.example.com/",
    },
    { names }
  );
  const metadata = {
    type: ["Book"],
    resources: [{ url: "file.html" }],
    readingOrder: [{ url: "file.html" }],
  };
  const archive = { metadata, base, names };
  const result = toJSON(archive);
  test.equal(result.resources[0].url, "http://media.example.com/file.html");
});
tap.test("metadata embed", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const base = new Base(
    {
      base: "http://test.example.com/",
      media: "http://media.example.com/",
      link: "http://link.example.com/",
      style: "http://style.example.com/",
    },
    { names }
  );
  const metadata = {
    type: ["Book"],
    resources: [{ url: "file.html" }],
    readingOrder: [{ url: "file.html" }],
  };
  const archive = { metadata, base, names };
  const result = embed(archive);
  test.notOk(result.resources);
  test.ok(result.url);
  test.notOk(result.readingOrder);
});
