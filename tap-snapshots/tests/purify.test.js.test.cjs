/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/purify.test.js TAP dompurify - html > dompurify html 1`] = `
<html><head>
    <style>body { background-color: red;}</style>
    </head><body>
    <h1>Test</h1>
    </body></html>
`

exports[`tests/purify.test.js TAP dompurify - invalid xhtml > dompurify invalid xhtml 1`] = `
<!--?xml version="1.0" encoding="utf-8"?--><!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml"><head>
    <style>body { background-color: red;}</style>
    </head><body>
    <br>
    <h1>Test</h1>
    <p><img src="/image.png"></p>
    </body></html>
`

exports[`tests/purify.test.js TAP dompurify - svg > dompurify svg 1`] = `
<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" height="20" width="38" style="background-color: red;"><path fill="#000" fill-rule="nonzero" d="M0 10c0 .546.414.983.932.983h33.887l-6.954 7.337a1.015 1.015 0 0 0 0 1.39.892.892 0 0 0 1.317 0l8.545-9.015a1.023 1.023 0 0 0 0-1.39L29.182.29a.892.892 0 0 0-1.317 0 1.015 1.015 0 0 0 0 1.39l6.954 7.337H.932C.414 9.017 0 9.454 0 10z"/>

<a xlink:href="#linkies"><image width="100" height="100" xlink:href="/path/to/img.jpg"/></a><image width="100" height="100" href="/path/to/second-img.jpg"/></svg>
`

exports[`tests/purify.test.js TAP dompurify - xhtml > dompurify xhtml 1`] = `
<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <link href="safe.css" rel="stylesheet" />
    <link href="http://dangerous.example.com/style.css" rel="stylesheet" />
    <style></style>
    </head><body>
    <h1 id="heading">Test</h1>
    <p data-epub-type="appendix"><a href="/relative/url">test</a><a href="http://example.com">test2</a></p>
    <p><img src="http://dangerous.example.com/image.png" /></p>
    <p><a href="#heading"><img src="/image.png" /></a></p>
    <p><img src="image.png" /></p>
    <p><img src="data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E" /></p>
    </body></html>
`
