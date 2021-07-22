/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/markup.test.js TAP markup - html > markup html 1`] = `
Object {
  "content": String(
    <soup-body class="HTML">
        <h2>Test</h2>
        </soup-body>
  ),
  "id": "1_id",
  "inLanguage": null,
  "links": Array [],
  "path": "chapter/path/page.html",
  "rel": Array [],
  "styles": Array [
    "[data-stylesheets~=\\"1_id\\"] soup-body { background-color: red;}",
  ],
  "title": "Test",
  "wordCount": 6,
}
`

exports[`tests/markup.test.js TAP markup - invalid xhtml > markup invalid xhtml 1`] = `
Object {
  "content": String(
    <soup-body>
        <br>
        <h2>Test</h2>
        <p><img loading="lazy" src="http://upload.example.com/2_id.png"></p>
        </soup-body>
  ),
  "id": "1_id",
  "inLanguage": "en",
  "links": Array [],
  "path": "chapter/path/page.html",
  "rel": Array [],
  "styles": Array [
    "[data-stylesheets~=\\"1_id\\"] soup-body { background-color: red;}",
  ],
  "title": "Test",
  "wordCount": 11,
}
`

exports[`tests/markup.test.js TAP markup - render html > markup render html html 1`] = `
<soup-chapter data-stylesheets="1_id" id="1_id" data-path="chapter/path/page.html" data-title="Test"  data-rel="">
  <soup-html><soup-body class="HTML">
    <h2>Test</h2>
    </soup-body></soup-html>
</soup-chapter>
`

exports[`tests/markup.test.js TAP markup - render html > markup render html styles 1`] = `
<style>[data-stylesheets~="1_id"] soup-body { background-color: red;}</style>

`

exports[`tests/markup.test.js TAP markup - render svg > markup render svg html 1`] = `
<soup-chapter data-stylesheets="1_id" id="1_id" data-path="chapter/path/svg.xhtml" data-title="SVG test" lang="en" data-rel="">
  <soup-html><soup-body xmlns="http://www.w3.org/1999/xhtml">
    <br />
<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" height="20" width="38" style="background-color: red;"><path fill="#000" fill-rule="nonzero" d="M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z"/><a xlink:href="#1_id:linkies"><image width="100" height="100" xlink:href="http://upload.example.com/2_id.jpg"/></a><image width="100" height="100" href="http://upload.example.com/3_id.jpg"/></svg></soup-body></soup-html>
</soup-chapter>
`

exports[`tests/markup.test.js TAP markup - render svg > markup render svg styles 1`] = `

`

exports[`tests/markup.test.js TAP markup - svg > markup svg 1`] = `
Object {
  "content": String(
    <soup-body xmlns="http://www.w3.org/1999/xhtml">
        <br />
    <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" height="20" width="38" style="background-color: red;"><path fill="#000" fill-rule="nonzero" d="M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z"/><a xlink:href="#1_id:linkies"><image width="100" height="100" xlink:href="http://upload.example.com/2_id.jpg"/></a><image width="100" height="100" href="http://upload.example.com/3_id.jpg"/></svg></soup-body>
  ),
  "id": "1_id",
  "inLanguage": "en",
  "links": Array [],
  "path": "chapter/path/svg.xhtml",
  "rel": Array [],
  "styles": Array [],
  "title": "SVG test",
  "wordCount": 5,
}
`

exports[`tests/markup.test.js TAP markup - xhtml > markup xhtml 1`] = `
Object {
  "content": String(
    <soup-body xmlns="http://www.w3.org/1999/xhtml">
        <h2 id="1_id:heading1">Test</h2>
        <p data-epub-type="appendix" class="Appendix"><a class="Relative" href="#3_id">test</a><a href="http://example.com">test2</a></p>
        <p></p>
        <p><img loading="lazy" srcset="http://upload.example.com/5_id.jpg 2x, http://upload.example.com/6_id.jpg 100w, http://upload.example.com/7_id.jpg 100w 2x" src="http://upload.example.com/4_id.png" /></p>
        <p><img loading="lazy" src="http://upload.example.com/8_id.png" /></p>
        <p><img loading="lazy" src="data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E" /></p>
        </soup-body>
  ),
  "id": "1_id",
  "inLanguage": "en",
  "links": Array [
    Object {
      "encodingFormat": "text/css",
      "path": "safe.css",
      "rel": Array [
        "stylesheet",
      ],
      "type": "LinkedResource",
      "url": "http://upload.example.com/2_id.css",
    },
  ],
  "path": "chapter/path/page.html",
  "rel": Array [],
  "styles": Array [
    Object {
      "encodingFormat": "text/css",
      "path": "safe.css",
      "rel": Array [
        "stylesheet",
      ],
      "type": "LinkedResource",
      "url": "http://upload.example.com/2_id.css",
    },
    "",
  ],
  "title": "Test",
  "wordCount": 13,
}
`
