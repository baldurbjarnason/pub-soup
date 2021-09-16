import { renderMarkup } from "./renderMarkup.js";
import { path } from "../../base.js";
import { Resource } from "../../resource.js";
import { getId } from "../../id.js";

export function renderNav(file: Resource) {
  const nav = file.value as any;
  const lang = file.inLanguage;
  file.value = `<soup-body>
  <nav aria-labelledby="soup-toc-heading" lang="${lang}" role="doc-toc">
    <h1 id="soup-toc-heading">${nav.heading}</h1>
    <ol>${nav.children.map((child) => renderChild(child, file)).join("")}
    </ol>
  </nav></soup-body>`;

  return renderMarkup(file, false);
}

function renderChild(child, file) {
  if (child.url) {
    const full = path(child.url, file.url);
    const fullURL = new URL(full, "https://example.com/");
    const hash = new URL(child.url, fullURL).hash;
    const id = hash ? getId(full, hash.replace("#", "")) : getId(full);
    return `
      <li><a href="#${id}">${child.label}</a>${renderChildren(
      child,
      file
    )}</li>`;
  } else {
    return `
      <li><span data-soup-nav-label>${child.label}</span>
      ${renderChildren(child, file)}</li>`;
  }
}

function renderChildren(child, file) {
  const { children = [] } = child;
  return child.children.length !== 0
    ? `
    <ol>${children.map((child) => renderChild(child, file)).join("")}
    </ol>`
    : "";
}
