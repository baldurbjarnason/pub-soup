/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
"use strict";
exports[`tests/css.test.js TAP css > parseCSS @import 1`] = `

`;

exports[`tests/css.test.js TAP css > parseCSS basic 1`] = `
[data-stylesheets~="http://upload.example.com/1_id.css"] soup-html.js soup-body.testClass span.someClass {background-color: red; --custom-property: url('http://upload.example.com/2_id.png')}@font-face {
    font-family: "Stix";
    font-weight: normal;
    font-style: normal;
    src: url(http://upload.example.com/3_id.otf);
  }
`;

exports[`tests/css.test.js TAP css > parseCSS data url 1`] = `
[data-stylesheets~="http://upload.example.com/1_id.css"] soup-html.js soup-body.testClass span.someClass {background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E');}
`;
