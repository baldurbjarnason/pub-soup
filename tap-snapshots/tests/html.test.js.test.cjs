/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/html.test.js TAP markup - html > markup html 1`] = `
{
  "type": [
    "LinkedResource"
  ],
  "value": "<soup-body class=\\"HTML\\">\\n    </soup-body>",
  "url": "chapter/path/page.html",
  "encodingFormat": "text/html",
  "rel": [],
  "name": "Test",
  "inLanguage": "en"
}
`

exports[`tests/html.test.js TAP markup - invalid xhtml > markup invalid xhtml 1`] = `
{
  "type": [
    "LinkedResource"
  ],
  "value": "<soup-body>\\n    <br>\\n    <h2>Test</h2>\\n    <p><img loading=\\"lazy\\" src=\\"image.png\\"></p>\\n    </soup-body>",
  "url": "chapter/path/page.html",
  "encodingFormat": "text/html",
  "rel": [],
  "name": "Test",
  "inLanguage": null
}
`

exports[`tests/html.test.js TAP markup - invalid xhtml > markup invalid xhtml styles 1`] = `
[
  "[id=\\"fileId\\"] soup-body { background-color: red;}"
]
`

exports[`tests/html.test.js TAP markup - invalid xhtml > markup invalid xhtml wordCount 1`] = `
11
`

exports[`tests/html.test.js TAP markup - svg > markup svg 1`] = `
{
  "type": [
    "LinkedResource"
  ],
  "value": "<svg xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" xmlns=\\"http://www.w3.org/2000/svg\\" height=\\"20\\" width=\\"38\\" style=\\"background-color: red;\\"><path fill=\\"#000\\" fill-rule=\\"nonzero\\" d=\\"M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z\\"/><a xlink:href=\\"#idY2hhcHRlci9wYXRoL3N2Zy54aHRtbA:bGlua2llcw\\"><image width=\\"100\\" height=\\"100\\" xlink:href=\\"path/to/img.jpg\\"/></a><a xlink:href=\\"#idY2hhcHRlci9wYXRoL3JlbGF0aXZlL3BhdGgvdG8vY2hhcHRlci54aHRtbA\\"><image width=\\"100\\" height=\\"100\\" xlink:href=\\"path/to/img.jpg\\"/></a></svg>",
  "url": "chapter/path/svg.xhtml",
  "encodingFormat": "text/html",
  "rel": [],
  "inLanguage": null
}
`

exports[`tests/html.test.js TAP markup - svg > markup svg styles 1`] = `
[]
`

exports[`tests/html.test.js TAP markup - svg > markup svg wordCount 1`] = `
0
`

exports[`tests/html.test.js TAP markup - xhtml > markup xhtml 1`] = `
{
  "type": [
    "LinkedResource"
  ],
  "value": "<soup-body xmlns=\\"http://www.w3.org/1999/xhtml\\">\\n    <h2 id=\\"idY2hhcHRlci9wYXRoL3BhZ2UuaHRtbA:aGVhZGluZzE\\">Test</h2>\\n    <p data-epub-type=\\"appendix\\" class=\\"Appendix\\"><a class=\\"Relative\\" href=\\"#idcmVsYXRpdmUvdXJs\\">test</a><a href=\\"http://example.com\\">test2</a><a class=\\"Heading\\" href=\\"#idY2hhcHRlci9wYXRoL3BhZ2UuaHRtbA:aGVhZGluZw\\">heading</a></p>\\n    <p></p>\\n    <p><img loading=\\"lazy\\" srcset=\\"images/Moby-Dick_FE_title_page-hd.jpg 2x, images/Moby-Dick_FE_title_page-phone.jpg 100w\\" src=\\"image.png\\" /></p>\\n    <p><img loading=\\"lazy\\" src=\\"image.png\\" /></p>\\n    <p><img loading=\\"lazy\\" src=\\"data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E\\" /></p>\\n    </soup-body>",
  "url": "chapter/path/page.html",
  "encodingFormat": "text/html",
  "rel": [],
  "name": "Test",
  "inLanguage": "en"
}
`

exports[`tests/html.test.js TAP markup - xhtml > markup xhtml styles 1`] = `
[
  {
    "type": "LinkedResource",
    "rel": [
      "stylesheet"
    ],
    "url": "chapter/path/safe.css",
    "id": "fileId",
    "encodingFormat": "text/css"
  },
  ""
]
`

exports[`tests/html.test.js TAP markup - xhtml > markup xhtml wordCount 1`] = `
14
`
