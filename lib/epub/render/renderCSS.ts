import { chapterStyles } from "../../css.js";
import { Epub } from "../index.js";
import pMap from "p-map";
import { ResourceDescriptor } from "../../resource.js";

export async function renderCSS(
  epub: Epub,
  styles: Array<ResourceDescriptor | string>,
  { concurrency }
) {
  const processed = await pMap(
    styles,
    async (style) => {
      if (typeof style === "string") {
        return style;
      } else {
        const file = await epub.getFileForResource(style);
        return chapterStyles(file.value, style.id, style);
      }
    },
    { concurrency }
  );
  return processed
    .map(
      (style) => `<style>
${style}</style>`
    )
    .join("\n");
}
