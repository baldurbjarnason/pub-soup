import { css } from "./css.js";
import { Names } from "./names.js";
import { attributes } from "./attributes.js";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Support srcset
const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ADD_TAGS: ["link"],
  FORBID_TAGS: ["meta", "form"],
  FORBID_ATTR: ["action", "background", "poster"],
};

export async function purify(file, { names = new Names() } = {}) {
  const { value, path, contentType = "text/html", id, base } = file;
  let styles = [];
  let links = [];
  const resourceURL = new URL(path, "https://example.com/");
  let dom;
  try {
    dom = new JSDOM(value, {
      contentType,
      url: "http://localhost",
    });
  } catch (err) {
    dom = new JSDOM(value, {
      contentType: "text/html",
      url: "http://localhost",
    });
  }
  const window = dom.window;
  for (const node of window.document.querySelectorAll("[style]")) {
    try {
      const styles = await css(
        `body {${node.getAttribute("style")}}`,
        resourceURL.href
      );
      node.setAttribute("style", styles.split(/{|}/)[1]);
    } catch (err) {
      node.removeAttribute("style");
    }
  }
  for (const node of window.document.querySelectorAll("style")) {
    try {
      styles = styles.concat(await css(node.textContent, resourceURL.href));
    } catch (err) {}
    node.remove();
  }
  let title = "";
  if (window.document.querySelector("h1")) {
    title = window.document.querySelector("h1").textContent;
  } else if (window.document.querySelector("title")) {
    title = window.document.querySelector("title").textContent;
  }
  const DOMPurify = createDOMPurify(window);
  // Based on sample from https://github.com/cure53/DOMPurify/tree/master/demos, same license as DOMPurify

  DOMPurify.addHook("uponSanitizeElement", function (node) {
    if (
      node.getAttributeNS &&
      node.getAttributeNS("http://www.idpf.org/2007/ops", "type")
    ) {
      node.dataset.epubType = node.getAttributeNS(
        "http://www.idpf.org/2007/ops",
        "type"
      );
    }
  });
  DOMPurify.addHook("afterSanitizeAttributes", function (node) {
    if (
      node.tagName.toLowerCase() === "link" &&
      node.hasAttribute("href") &&
      node.getAttribute("rel") === "stylesheet" &&
      !testPath(node.getAttribute("href"), resourceURL)
    ) {
      node.remove();
    } else if (
      node.tagName.toLowerCase() === "link" &&
      node.hasAttribute("href") &&
      node.getAttribute("rel") === "stylesheet" &&
      testPath(node.getAttribute("href"), resourceURL)
    ) {
      links = links.concat({
        type: "LinkedResource",
        rel: ["stylesheet"],
        url: base.transform(node.getAttribute("href"), path, "style"),
        encodingFormat: "text/css",
      });
      node.remove();
    }
    attributes(node, base, path);
  });
  DOMPurify.sanitize(window.document.documentElement, purifyConfig);
  const soupBody = window.document.createElement("soup-body");
  cloneAttributes(soupBody, window.document.body);
  soupBody.append(...window.document.body.children);
  return {
    styles,
    links,
    path,
    content: soupBody.outerHTML,
    id,
    title,
  };
}

function testPath(path, resourceURL) {
  const base = new URL(resourceURL, "http://example.com");
  const url = new URL(path, base);
  // If the hostname doesn't equal that of the base URL we provided, then it is a full URL and so not supported
  return url.hostname === base.hostname;
}

function cloneAttributes(target, source) {
  [...source.attributes].forEach((attr) => {
    target.setAttribute(attr.nodeName, attr.nodeValue);
  });
}
