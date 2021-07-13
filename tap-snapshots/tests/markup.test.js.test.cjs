/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/markup.test.js TAP markup - html > markup html 1`] = `
Object {
  "content": "<soup-body class=\\"HTML\\"><h1>Test</h1></soup-body>",
  "id": "1_id",
  "inLanguage": null,
  "links": Array [],
  "path": "chapter/path/page.html",
  "styles": Array [
    "[data-stylesheets~=\\"1_id\\"] soup-body { background-color: red;}",
  ],
  "title": "Test",
}
`

exports[`tests/markup.test.js TAP markup - invalid xhtml > markup invalid xhtml 1`] = `
Object {
  "content": "<soup-body><br><h1>Test</h1><p><img src=\\"http://media.example.com/2_id\\"></p></soup-body>",
  "id": "1_id",
  "inLanguage": "en",
  "links": Array [],
  "path": "chapter/path/page.html",
  "styles": Array [
    "[data-stylesheets~=\\"1_id\\"] soup-body { background-color: red;}",
  ],
  "title": "Test",
}
`

exports[`tests/markup.test.js TAP markup - render html > markup render html html 1`] = `
<soup-chapter data-stylesheets="1_id" id="1_id" data-path="chapter/path/page.html" data-title="Test" null>
  <soup-html><soup-body class="HTML"><h1>Test</h1></soup-body></soup-html>
</soup-chapter>
`

exports[`tests/markup.test.js TAP markup - render html > markup render html styles 1`] = `
<style>[data-stylesheets~="1_id"] soup-body { background-color: red;}</style>

`

exports[`tests/markup.test.js TAP markup - render svg > markup render svg html 1`] = `
<soup-chapter data-stylesheets="1_id" id="1_id" data-path="chapter/path/svg.xhtml" data-title="SVG test" lang="en">
  <soup-html><soup-body><br><svg xmlns="http://www.w3.org/2000/svg" height="20" width="38" style="background-color: red;"><path fill="#000" fill-rule="nonzero" d="M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z"></path><a xlink:href="#1_id:linkies"><image xlink:href="http://media.example.com/2_id"></image></a><image href="http://media.example.com/3_id"></image></svg></soup-body></soup-html>
</soup-chapter>
`

exports[`tests/markup.test.js TAP markup - render svg > markup render svg styles 1`] = `

`

exports[`tests/markup.test.js TAP markup - render xhtml > markup render xhtml stylesheets 1`] = `
<link rel="stylesheet" href="http://style.example.com/2_id">

`

exports[`tests/markup.test.js TAP markup - svg > markup svg 1`] = `
Object {
  "content": "<soup-body><br><svg xmlns=\\"http://www.w3.org/2000/svg\\" height=\\"20\\" width=\\"38\\" style=\\"background-color: red;\\"><path fill=\\"#000\\" fill-rule=\\"nonzero\\" d=\\"M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z\\"></path><a xlink:href=\\"#1_id:linkies\\"><image xlink:href=\\"http://media.example.com/2_id\\"></image></a><image href=\\"http://media.example.com/3_id\\"></image></svg></soup-body>",
  "id": "1_id",
  "inLanguage": "en",
  "links": Array [],
  "path": "chapter/path/svg.xhtml",
  "styles": Array [],
  "title": "SVG test",
}
`

exports[`tests/markup.test.js TAP markup - xhtml > markup xhtml 1`] = `
Object {
  "content": "<soup-body xmlns=\\"http://www.w3.org/1999/xhtml\\"><h1 id=\\"1_id:heading1\\">Test</h1><p data-epub-type=\\"appendix\\" class=\\"Appendix\\"><a class=\\"Relative\\" href=\\"#3_id\\">test</a><a href=\\"http://example.com\\">test2</a></p><p></p><p><img srcset=\\"http://media.example.com/5_id 2x, http://media.example.com/6_id 100w, http://media.example.com/7_id 100w 2x\\" src=\\"http://media.example.com/4_id\\" /></p><p><img src=\\"http://media.example.com/8_id\\" /></p><p><img src=\\"data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E\\" /></p></soup-body>",
  "id": "1_id",
  "inLanguage": "en",
  "links": Array [
    Object {
      "encodingFormat": "text/css",
      "rel": Array [
        "stylesheet",
      ],
      "type": "LinkedResource",
      "url": "http://style.example.com/2_id",
    },
  ],
  "path": "chapter/path/page.html",
  "styles": Array [],
  "title": "Test",
}
`
