import {
  renderImage,
  renderMarkup,
  renderStylesheets,
  renderStyles,
} from "./stringify-markup.js";
import { render } from "./stringify-nav.js";
import { embed } from "../../metadata.js";

// This needs to embed the metadata
// Do we need to include a link to contents?
export function stringify(epub) {
  let strings = [
    `<script type="application/ld+json">
${JSON.stringify(embed(epub))}
    </script>`,
  ];
  // Render nav

  if (epub._contents) {
    strings = strings.concat(render(epub._contents, epub));
  }
  // for each resource in epub._metadata.readingOrder, render markup file
  const resources = epub._metadata.readingOrder.map((resource) => resource.url);
  for (const resource of resources) {
    const chapter = epub.chapters.find((file) => file.path === resource);
    strings = strings.concat(renderMarkup(chapter));
  }
  const nonLinear = epub.chapters.filter(
    (file) => !resources.includes(file.path)
  );

  // render non-linear markup
  for (const markup of nonLinear) {
    strings = strings.concat(renderMarkup(markup, false));
  }
  // render images from resources.
  const images = epub._metadata.resources.filter((resource) =>
    resource.encodingFormat.includes("image")
  );
  for (const image of images) {
    const id = epub.names.id(image.url);
    const href = epub.base.upload(image.url);
    const file = {
      id,
      path: image.url,
      href,
      title: `Image ${images.indexOf(image) + 1}`,
      rel: [].concat(image.rel),
    };
    strings = strings.concat(renderImage(file));
  }

  // render styles and stylesheets for head
  const styles = epub.chapters
    .map((markup) => {
      const stylesheets = renderStylesheets(markup.links);
      const styles = renderStyles(markup.styles);
      return [stylesheets, styles];
    })
    .flat()
    .join("\n");
  return { body: strings.join("\n"), styles };
}
