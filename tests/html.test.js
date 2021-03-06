import { markup } from "../dist/lib/parsers/html.js";
// import { File, Base, Names } from "../src/zip/index.js";
import { Resource } from "../dist/lib/resource.js";
// import {
//   renderMarkup,
//   renderStyles,
//   // renderStylesheets,
// } from "../src/epub/stringify/stringify-markup.js";
import tap from "tap";

let results = [];

tap.formatSnapshot = (obj) => JSON.stringify(obj, null, 2);

tap.test("markup - svg", async (test) => {
  const file = new Resource({
    value: `<svg style="position: fixed; background-color: red;" width="38" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z" fill-rule="nonzero" fill="#000" style="}background-color: red;}" /><a xlink:href="#linkies"><image xlink:href="path/to/img.jpg" height="100" width="100" /></a><a xlink:href="relative/path/to/chapter.xhtml"><image xlink:href="path/to/img.jpg" height="100" width="100" /></a><image href="http://example.com/path/to/second-img.jpg" height="100" width="100" /></svg>`,
    url: "chapter/path/svg.xhtml",
    encodingFormat: "image/svg+xml",
    id: "fileId",
  });
  const result = await markup(file);
  results = results.concat(result);
  test.matchSnapshot(result, "markup svg");
  test.matchSnapshot(result.styles(), "markup svg styles");
  test.matchSnapshot(result.wordCount(), "markup svg wordCount");
});

tap.test("markup - html", async (test) => {
  const file = new Resource({
    value: `<html lang="en"><head>
    <style>body {position: fixed; background-color: red;}</style>
    <title>Test</title>
    </head><body class="HTML">
    </body></html>`,
    url: "chapter/path/page.html",
    id: "fileId",
  });
  const result = await markup(file);
  results = results.concat(result);
  test.matchSnapshot(result, "markup html");
});

tap.test("markup - xhtml", async (test) => {
  const file = new Resource({
    value: `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en"
    lang="en">
    <head>
    <link rel="stylesheet" href="safe.css" />
    <link rel="stylesheet" href="http://dangerous.example.com/style.css" />
    <style>body {}position: fixed; background-color: red;}</style>
    </head><body>
    <h1 id="heading1">Test</h1>
    <p epub:type="appendix" class="Appendix"><a href="/relative/url" class="Relative">test</a><a href="http://example.com">test2</a><a href="#heading" class="Heading">heading</a></p>
    <p><img src="http://dangerous.example.com/image.png" class="Dangerous" /></p>
    <p><img src="image.png" srcset="images/Moby-Dick_FE_title_page-hd.jpg 2x, images/Moby-Dick_FE_title_page-phone.jpg 100w, http://dangerous.example.com/images/Moby-Dick_FE_title_page-phone-HD.jpg 100w 2x" /></p>
    <p><img src="image.png" /></p>
    <p><img src="data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E" /></p>
    </body></html>`,
    url: "chapter/path/page.html",
    encodingFormat: "application/xhtml+xml",
    id: "fileId",
  });
  const result = await markup(file);
  results = results.concat(result);
  test.matchSnapshot(result, "markup xhtml");
  test.matchSnapshot(result.styles(), "markup xhtml styles");
  test.matchSnapshot(result.wordCount(), "markup xhtml wordCount");
});

tap.test("markup - invalid xhtml", async (test) => {
  const file = new Resource({
    value: `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head>
    <style>body {position: fixed; background-color: red;}</style>
    </head><body>
    <br>
    <h1>Test</h1>
    <p><img src="image.png" /></p>
    </body></html>`,
    url: "chapter/path/page.html",
    encodingFormat: "application/xhtml+xml",
    id: "fileId",
  });
  const result = await markup(file);
  results = results.concat(result);
  test.matchSnapshot(result, "markup invalid xhtml");
  test.matchSnapshot(result.styles(), "markup invalid xhtml styles");
  test.matchSnapshot(result.wordCount(), "markup invalid xhtml wordCount");
});

// tap.test("markup - render svg", async (test) => {
//   const result = renderMarkup(results[0]);
//   test.matchSnapshot(result, "markup render svg html");
//   const styles = renderStyles(results[0].styles);
//   test.matchSnapshot(styles, "markup render svg styles");
// });

// tap.test("markup - render html", async (test) => {
//   const result = renderMarkup(results[1]);
//   test.matchSnapshot(result, "markup render html html");
//   const styles = renderStyles(results[1].styles);
//   test.matchSnapshot(styles, "markup render html styles");
// });

// tap.test("markup - render xhtml", async (test) => {
//   console.log(results[2].styles);
//   const styles = renderStylesheets(results[2].links);
//   test.matchSnapshot(styles, "markup render xhtml stylesheets");
// });
