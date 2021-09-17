import { chapterStyles } from "../../css.js";
import { Epub } from "../../epub/index.js";
import pMap from "p-map";
import { ResourceDescriptor, Resource } from "../../resource.js";

export async function renderCSS(
  epub: Epub,
  styles: Array<Resource | string>,
  { concurrency }
) {
  const processed = await pMap(
    styles,
    async (style) => {
      if (typeof style === "string") {
        return style;
      } else {
        const file = await epub.fileForResource(style);
        return chapterStyles(file.value, style.getValue("chapterId"), style);
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
