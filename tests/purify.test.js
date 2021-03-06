import { purify } from "../dist/lib/parsers/purify.js";
// import { File, Base, Names } from "../src/zip/index.js";
import { Resource } from "../dist/lib/resource.js";
import tap from "tap";

tap.test("dompurify - svg", async (test) => {
  const file = new Resource({
    value: `<?xml version="1.0" encoding="utf-8"?>
<svg style="position: fixed; background-color: red;" width="38" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z" fill-rule="nonzero" fill="#000" style="}background-color: red;}" />

<a xlink:href="#linkies"><image xlink:href="/path/to/img.jpg" height="100" width="100"  /></a><image href="/path/to/second-img.jpg"  height="100" width="100" /></svg>`,
    id: "fileId",
    url: "chapter/path/page.svg",
    encodingFormat: "image/svg+xml",
  });
  const result = await purify(file);
  test.matchSnapshot(result, "dompurify svg");
});

tap.test("dompurify - html", async (test) => {
  const file = new Resource({
    value: `<html><head>
    <style>body {position: fixed; background-color: red;}</style>
    </head><body>
    <h1>Test</h1>
    </body></html>`,
    id: "fileID",
    url: "chapter/path/page.html",
  });
  const result = await purify(file);
  test.matchSnapshot(result, "dompurify html");
});

tap.test("dompurify - xhtml", async (test) => {
  const file = new Resource({
    value: `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en"
    lang="en">
    <head>
    <link rel="stylesheet" href="safe.css" />
    <link rel="stylesheet" href="http://dangerous.example.com/style.css" />
    <style>body {}position: fixed; background-color: red;}</style>
    </head><body>
    <h1 id="heading">Test</h1>
    <p epub:type="appendix"><a href="/relative/url">test</a><a href="http://example.com">test2</a></p>
    <p><img src="http://dangerous.example.com/image.png" /></p>
    <p><a href="#heading"><img src="/image.png" /></a></p>
    <p><img src="image.png" /></p>
    <p><img src="data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E" /></p>
    </body></html>`,
    url: "chapter/path/page.html",
    encodingFormat: "application/xhtml+xml",
  });
  const result = await purify(file);
  test.matchSnapshot(result, "dompurify xhtml");
});

tap.test("dompurify - invalid xhtml", async (test) => {
  const file = new Resource({
    value: `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en"
    lang="en"><head>
    <style>body {position: fixed; background-color: red;}</style>
    </head><body>
    <br>
    <h1>Test</h1>
    <p><img src="/image.png" /></p>
    </body></html>`,
    url: "chapter/path/page.html",
    encodingFormat: "application/xhtml+xml",
  });
  const result = await purify(file);
  test.matchSnapshot(result, "dompurify invalid xhtml");
});
