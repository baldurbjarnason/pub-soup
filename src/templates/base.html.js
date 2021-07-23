// HTML escaping functions
// Array rendering functions

import { meta } from "./meta.html.js";
import { scripts } from "./scripts.html.js";
import { style } from "./style.html.js";
import html, { safe } from "escape-html-template";

export function base(context) {
  return html`<!DOCTYPE html>
    <html lang="${context.metadata.inLanguage}" class="no-js">
      <head>
        ${meta(context)} ${scripts(context)} ${style(context)}
      </head>

      <body>
        ${safe(context.header || "")}
        <main>${safe(context.value.body)}</main>
        ${safe(context.footer || "")}
      </body>
    </html>`;
}
