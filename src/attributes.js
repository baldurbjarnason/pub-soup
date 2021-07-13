import validDataUrl from "valid-data-url";

export function attributes(node, file) {
  const { base, path } = file;
  if (node.hasAttribute("id")) {
    node.setAttribute("id", base.id(node.getAttribute("id"), path));
  }
  // All src attributes that are left unsanitized should be valid media references
  // All src urls must be relative. This will have to be improved once we start expanding our format support
  if (
    node.hasAttribute("src") &&
    !base.full(node.getAttribute("src"), path) &&
    !validDataUrl(node.getAttribute("src"))
  ) {
    node.remove();
  } else if (
    node.hasAttribute("src") &&
    base.full(node.getAttribute("src"), path) &&
    !validDataUrl(node.getAttribute("src"))
  ) {
    node.setAttribute("src", file.src(node.getAttribute("src")));
  }

  // Need to support responsive images as well
  if (node.hasAttribute("srcset")) {
    node.setAttribute("srcset", file.srcset(node.getAttribute("srcset")));
  }

  // There are two types of href attributes that remain: links (which become internal id refs) and SVG images
  if (node.hasAttribute("href") && !validDataUrl(node.getAttribute("href"))) {
    const type = node.localName === "image" ? "media" : "link";
    node.setAttribute(
      "href",
      base.transform(node.getAttribute("href"), path, type)
    );
  }
  // then there is xlink:href on images
  if (
    node.getAttributeNS("http://www.w3.org/1999/xlink", "href") &&
    !validDataUrl(node.getAttributeNS("http://www.w3.org/1999/xlink", "href"))
  ) {
    const type = node.localName === "image" ? "media" : "link";
    node.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      base.transform(
        node.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
        path,
        type
      )
    );
  }
}
