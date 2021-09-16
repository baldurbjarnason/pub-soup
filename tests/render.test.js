import { renderMarkup } from "../dist/lib/view/render/renderMarkup.js";
import tap from "tap";
import { Resource } from "../dist/lib/resource.js";

const markupFile = `<soup-chapter id="idY292ZXIueGh0bWw" data-path="cover.xhtml" data-title="Cover" lang="en" data-linear="false" hidden data-rel="">
  <soup-html><soup-body><div id="cover-image"><img src="cover.jpg" alt="This is an ePub experiment" /></div></soup-body></soup-html>
</soup-chapter>`;

const xhtml = `<soup-body><div id="cover-image"><img src="cover.jpg" alt="This is an ePub experiment" /></div></soup-body>`;

const resource = new Resource({
  value: xhtml,
  url: "cover.xhtml",
  encodingFormat: "application/xhtml+xml",
  name: "Cover",
  rel: [],
  _meta: {
    styles: ["body { oeb-column-number:1; }"],
    wordCount: 85,
  },
  inLanguage: "en",
});

tap.test("Render Markup", async (test) => {
  const result = renderMarkup(resource, false);
  test.same(result, markupFile);
});
