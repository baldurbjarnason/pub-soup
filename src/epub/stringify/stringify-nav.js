export function render(file, { metadata }) {
  const nav = file.value;
  const lang = nav.inLanguage;
  return `<soup-toc>
  <nav aria-labelledby="soup-toc-heading" lang="${lang}">
    <h1 id="soup-toc-heading">${nav.heading}</h1>
    <ol>${nav.children.map((child) => renderChild(child, file)).join("")}
    </ol>
  </nav>
</soup-toc>`;
}

function renderChild(child, file) {
  if (child.url) {
    return `
      <li><a href="${file.href(child.url)}">${child.label}</a>${renderChildren(
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
