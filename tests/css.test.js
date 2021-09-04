import { chapterStyles as css } from "../dist/lib/css.js";
import { Resource } from "../dist/lib/resource.js";
import tap from "tap";

tap.test("css", async (test) => {
  const file = setup();
  const cssString = `html.js body.testClass span.someClass {background-color: red; position: fixed; text-align: justify; fake-property: bling; --custom-property: url('what-is-this/image.png'); background-image: url('https://dangerous.example.com/test.png')} div {position: fixed;}@font-face {
    font-family: "Stix";
    font-weight: normal;
    font-style: normal;
    src: url(../fonts/STIXGeneral.otf);
  }`;
  const result = await css(cssString, "fileID", file);
  test.matchSnapshot(result, "parseCSS basic");
});

tap.test("css", async (test) => {
  const file = setup();
  const cssString = `@import url("http://dangerous.example.com/style.css")`;
  const result = await css(cssString, "fileID", file);
  test.matchSnapshot(result, "parseCSS @import");
});

tap.test("css", async (test) => {
  const file = setup();
  const cssString = `html.js body.testClass span.someClass {background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E');}`;
  const result = await css(cssString, "fileID", file);
  test.matchSnapshot(result, "parseCSS data url");
});

tap.test("css headings", async (test) => {
  const file = setup();
  const cssString = `h1, h2, h3, h4.dingus, h5#hohoho, h6 {background-color: green;}`;
  const result = await css(cssString, "fileID", file);
  test.equal(
    result,
    `[id="fileID"] h2, [id="fileID"] h3, [id="fileID"] h4, [id="fileID"] h5.dingus, [id="fileID"] h6#hohoho, [id="fileID"] h6 {background-color: green;}`
  );
});
function setup() {
  const file = new Resource({
    value: "",
    encodingFormat: "text/css",
    url: "styles/test.css",
  });
  return file;
}
