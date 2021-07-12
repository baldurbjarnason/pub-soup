import { Base } from "../src/base.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const tap = require("tap");

tap.test("base", async (test) => {
  const base = new Base();
  test.equal(base.href("/test"), "/test");
  test.equal(base.media("/test"), "/test");
  test.equal(base.link("/test"), "/test");
  test.equal(base.style("/test"), "/test");
});

tap.test("base", async (test) => {
  const base = new Base({
    base: "http://test.example.com/",
    media: "http://media.example.com/",
    link: "http://link.example.com/",
    style: "http://style.example.com/",
  });
  test.equal(base.href("/test"), "http://test.example.com/test");
  test.equal(base.media("/test"), "http://media.example.com/test");
  test.equal(base.link("/test"), "http://link.example.com/test");
  test.equal(base.style("/test"), "http://style.example.com/test");
});
