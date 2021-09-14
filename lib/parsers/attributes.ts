import { getId } from "../id.js";
import { ResourceDescriptor } from "../resource.js";
import { path } from "../base.js";
import validDataUrl from "valid-data-url";
import srcset from "srcset";

export function src(node, resource) {
  const { url } = resource;
  if (
    node.hasAttribute("src") &&
    !path(node.getAttribute("src"), url) &&
    !validDataUrl(node.getAttribute("src"))
  ) {
    node.remove();
  }
  if (node.hasAttribute("srcset")) {
    // Need to support responsive images as well
    const parsed = srcset.parse(node.getAttribute("srcset")).filter((src) => {
      return path(src.url, url);
    });
    node.setAttribute("srcset", srcset.stringify(parsed));
  }
}

export function href(node, resource: ResourceDescriptor) {
  const { url } = resource;
  // There are two types of href attributes that remain: anchors (which become internal id refs) and SVG images
  if (node.localName === "a" && node.hasAttribute("href")) {
    const href = node.getAttribute("href");
    const full = path(href, url);
    if (full) {
      const fullURL = new URL(full, "https://example.com/");
      const hash = new URL(href, fullURL).hash;
      const id = hash ? getId(full, hash.replace("#", "")) : getId(full);
      node.setAttribute("href", "#" + id);
    }
  } else if (
    node.localName !== "image" &&
    node.hasAttributeNS("http://www.w3.org/1999/xlink", "href")
  ) {
    const href = node.getAttributeNS("http://www.w3.org/1999/xlink", "href");
    const full = path(
      node.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
      url
    );

    if (full) {
      const fullURL = new URL(full, "https://example.com/");
      const hash = new URL(href, fullURL).hash;
      const id = hash ? getId(full, hash.replace("#", "")) : getId(full);
      node.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + id);
    }
  } else if (
    node.hasAttribute("href") &&
    !path(node.getAttribute("href"), url) &&
    !validDataUrl(node.getAttribute("href"))
  ) {
    node.remove();
  }
}

// Currently we don't allow external urls in images. May allow https image srces later.
export function attributes(node, resource: ResourceDescriptor) {
  const { url } = resource;
  if (node.hasAttribute("id")) {
    node.setAttribute("id", getId(url, node.getAttribute("id")));
  }
  src(node, resource);
  href(node, resource);
}
