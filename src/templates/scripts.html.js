import html from "escape-html-template";
import { ifSafe } from "./ifsafe.js";
export function scripts(context) {
  const { scripts = [], modules = [] } = context;
  return (
    ifSafe(context.scriptHTML) ||
    html` <script type="module">
        document.documentElement.classList.remove("no-js");
        document.documentElement.classList.add("js");
      </script>
      ${scripts
        .map((url) => html`<script src="${url}" defer></script>`)
        .join("\n")}
      ${modules
        .map((url) => html`<script src="${url}" type="module"></script>`)
        .join("\n")}`
  );
}
