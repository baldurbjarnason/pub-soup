export function shiftTagName(name) {
  const level = Number.parseInt(name.toLowerCase().replace("h", ""));
  return `h${level + 1}`;
}

export function shiftHeading(node, window) {
  const heading = window.document.createElement(shiftTagName(node.tagName));
  cloneAttributes(heading, node);
  heading.append(...node.childNodes);
  node.replaceWith(heading);
}

function cloneAttributes(target, source) {
  [...source.attributes].forEach((attr) => {
    target.setAttribute(attr.nodeName, attr.nodeValue);
  });
}
