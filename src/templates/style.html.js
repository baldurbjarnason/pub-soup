import html, { safe } from "escape-html-template";
import { ifSafe } from "./ifsafe.js";
export function style(context) {
  const { stylesheets = [] } = context;
  const { styles } = context.value;
  return (
    ifSafe(context.stylesHTML) ||
    html` ${stylesheets
      .map((url) => html`<link rel="stylesheet" href="${url}" />`)
      .join("\n")}
    ${safe(styles)}`
  );
}
