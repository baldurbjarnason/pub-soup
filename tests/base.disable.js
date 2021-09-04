import { Base, Names } from "../src/zip/index.js";
import tap from "tap";

tap.test("base", async (test) => {
  const base = new Base();
  test.equal(base.href("/test"), "/test");
  test.equal(base.upload("/test"), "/test");
  test.equal(base.link("/test"), "/test");
});

tap.test("base", async (test) => {
  const base = new Base({
    base: "http://test.example.com/",
    upload: "http://upload.example.com/",
  });
  test.equal(base.href("/test"), "http://test.example.com/test");
  test.equal(base.upload("/test"), "http://upload.example.com/test");
  test.equal(base.link("/test"), "http://test.example.com/test");
});

tap.test("base - full", async (test) => {
  const base = new Base({
    base: "http://test.example.com/",
    upload: "http://upload.example.com/",
  });
  test.equal(
    base.full("relative/path/src.img", "chapter/path.xhtml"),
    "chapter/relative/path/src.img"
  );
  test.equal(
    base.full("http://img.example.com/path/src.img", "chapter/path.xhtml"),
    null
  );
});

tap.test("base - id", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const base = new Base(
    {
      base: "http://test.example.com/",
      upload: "http://upload.example.com/",
    },
    { names }
  );
  test.equal(base.id("heading", "chapter/path.xhtml"), "1_id:heading");
});
tap.test("base - srcset", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const base = new Base(
    {
      base: "http://test.example.com/",
      upload: "http://upload.example.com/",
    },
    { names }
  );
  test.equal(
    base.srcset(
      "images/Moby-Dick_FE_title_page-hd.jpg 2x, images/Moby-Dick_FE_title_page-phone.jpg 100w, images/Moby-Dick_FE_title_page-phone-HD.jpg 100w 2x",
      "chapter/path.xhtml"
    ),
    "http://upload.example.com/1_id.jpg 2x, http://upload.example.com/2_id.jpg 100w, http://upload.example.com/3_id.jpg 100w 2x"
  );
});

tap.test("base - transform", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const base = new Base(
    {
      base: "http://test.example.com/",
      upload: "http://upload.example.com/",
    },
    { names }
  );
  test.equal(
    base.transform("path/subchapter.xhtml", "chapter/path.xhtml", "link"),
    "#1_id"
  );
  test.equal(
    base.transform(
      "path/subchapter.xhtml#heading",
      "chapter/path.xhtml",
      "link"
    ),
    "#1_id:heading"
  );
  test.equal(
    base.transform("relative/path/src.img", "chapter/path.xhtml", "upload"),
    "http://upload.example.com/2_id.img"
  );
  test.equal(
    base.transform("http://img.example.com/path/src.img", "chapter/path.xhtml"),
    "http://img.example.com/path/src.img"
  );
  test.equal(
    base.transform(
      "../chapter1/path.xhtml#heading",
      "chapter/path.xhtml",
      "link"
    ),
    "#3_id:heading"
  );
});