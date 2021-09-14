/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/html.test.js TAP markup - html > markup html 1`] = `
Resource {
  "_meta": Object {
    "styles": Array [
      "[id=\\"fileId\\"] soup-body { background-color: red;}",
    ],
    "title": "Test",
    "wordCount": 6,
  },
  "encodingFormat": "text/html",
  "id": "fileId",
  "inLanguage": "en",
  "rel": Array [],
  "type": Array [
    "LinkedResource",
  ],
  "url": "chapter/path/page.html",
  "value": String(
    <soup-body class="HTML">
        </soup-body>
  ),
}
`

exports[`tests/html.test.js TAP markup - invalid xhtml > markup invalid xhtml 1`] = `
Resource {
  "_meta": Object {
    "styles": Array [
      "[id=\\"fileId\\"] soup-body { background-color: red;}",
    ],
    "title": "Test",
    "wordCount": 11,
  },
  "encodingFormat": "text/html",
  "id": "fileId",
  "inLanguage": null,
  "rel": Array [],
  "type": Array [
    "LinkedResource",
  ],
  "url": "chapter/path/page.html",
  "value": String(
    <soup-body>
        <br>
        <h2>Test</h2>
        <p><img loading="lazy" src="image.png"></p>
        </soup-body>
  ),
}
`

exports[`tests/html.test.js TAP markup - svg > markup svg 1`] = `
Resource {
  "_meta": Object {
    "styles": Array [],
    "title": "",
    "wordCount": 0,
  },
  "encodingFormat": "text/html",
  "id": "fileId",
  "inLanguage": null,
  "rel": Array [],
  "type": Array [
    "LinkedResource",
  ],
  "url": "chapter/path/svg.xhtml",
  "value": "<svg xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" xmlns=\\"http://www.w3.org/2000/svg\\" height=\\"20\\" width=\\"38\\" style=\\"background-color: red;\\"><path fill=\\"#000\\" fill-rule=\\"nonzero\\" d=\\"M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z\\"/><a xlink:href=\\"#idY2hhcHRlci9wYXRoL3N2Zy54aHRtbA:bGlua2llcw\\"><image width=\\"100\\" height=\\"100\\" xlink:href=\\"path/to/img.jpg\\"/></a><a xlink:href=\\"#idY2hhcHRlci9wYXRoL3JlbGF0aXZlL3BhdGgvdG8vY2hhcHRlci54aHRtbA\\"><image width=\\"100\\" height=\\"100\\" xlink:href=\\"path/to/img.jpg\\"/></a></svg>",
}
`

exports[`tests/html.test.js TAP markup - xhtml > markup xhtml 1`] = `
Resource {
  "_meta": Object {
    "styles": Array [
      Object {
        "encodingFormat": "text/css",
        "id": "fileId",
        "rel": Array [
          "stylesheet",
        ],
        "type": "LinkedResource",
        "url": "chapter/path/safe.css",
      },
      "",
    ],
    "title": "Test",
    "wordCount": 14,
  },
  "encodingFormat": "text/html",
  "id": "fileId",
  "inLanguage": "en",
  "rel": Array [],
  "type": Array [
    "LinkedResource",
  ],
  "url": "chapter/path/page.html",
  "value": String(
    <soup-body xmlns="http://www.w3.org/1999/xhtml">
        <h2 id="idY2hhcHRlci9wYXRoL3BhZ2UuaHRtbA:aGVhZGluZzE">Test</h2>
        <p data-epub-type="appendix" class="Appendix"><a class="Relative" href="#idcmVsYXRpdmUvdXJs">test</a><a href="http://example.com">test2</a><a class="Heading" href="#idY2hhcHRlci9wYXRoL3BhZ2UuaHRtbA:aGVhZGluZw">heading</a></p>
        <p></p>
        <p><img loading="lazy" srcset="images/Moby-Dick_FE_title_page-hd.jpg 2x, images/Moby-Dick_FE_title_page-phone.jpg 100w" src="image.png" /></p>
        <p><img loading="lazy" src="image.png" /></p>
        <p><img loading="lazy" src="data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E" /></p>
        </soup-body>
  ),
}
`
