import { css } from "../../css.js";

export async function renderCSS(epub) {
  // let commonCSS = true;
  // const completedCSS = {};
  let styles = [];
  for (const markup of epub.chapters) {
    styles = styles.concat(
      await Promise.all(markup.styles.map(pageCSSmap(markup)))
    );
  }
  styles = styles
    .map(
      (style) => `<style>
${style}</style>`
    )
    .join("\n");
  return styles;
  function pageCSSmap(markup) {
    return async function renderPageCSS(style, index) {
      if (style.path) {
        // if (
        //   !epub.chapters.every(
        //     (markup) => markup.styles[index].path === style.path
        //   )
        // ) {
        //   commonCSS = false;
        // }
        const file = await epub.getTextFile({
          ...style,
          url: style.path,
          encodingFormat: "text/css",
        });
        // if (commonCSS && !completedCSS[file.path]) {
        //   completedCSS[file.path] = true;
        //   return css(file.value, style.path, file);
        // }
        return css(file.value, markup.id, file);
      } else {
        return style;
      }
    };
  }
}
