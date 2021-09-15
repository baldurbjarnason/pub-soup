import { renderImage, renderMarkup } from "./renderMarkup.js";
import { renderNav } from "./renderNav.js";
// import { embed } from "../../metadata.js";
import { getId } from "../../id.js";

// This needs to embed the metadata
// Do we need to include a link to contents?
export function render(epub, { metadata, contents, chapters }) {
  let strings = [
    `<script type="application/ld+json">
${JSON.stringify(metadata.embed())}
    </script>`,
  ];
  // Render nav

  if (contents) {
    strings = strings.concat(renderNav(contents));
  }
  // for each resource in epub._metadata.readingOrder, render markup file
  const resources = metadata.readingOrder.map((resource) => resource.url);
  for (const resource of resources) {
    const chapter = chapters.find((file) => file.url === resource);
    strings = strings.concat(renderMarkup(chapter));
  }
  const nonLinear = chapters.filter((file) => !resources.includes(file.url));

  // render non-linear markup
  for (const markup of nonLinear) {
    strings = strings.concat(renderMarkup(markup, false));
  }
  // render images from resources.
  const images = metadata.images();
  for (const image of images) {
    image.id = getId(image.url);
    image.name = `Image ${images.indexOf(image) + 1}`;
    strings = strings.concat(renderImage(image));
  }

  // render styles and stylesheets for head
  // Each chapter needs all of its CSS scoped to it.
  const styles = chapters
    .map((markup) => {
      return markup.styles();
    })
    .flat();
  return { body: strings.join("\n"), styles };
}
