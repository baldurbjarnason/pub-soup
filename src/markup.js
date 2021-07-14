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

export async function markup(file, { names = new Names() } = {}) {
  const { value, path, contentType = "text/html", id } = file;
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
  const document = window.document;
  let inLanguage;
  if (document.documentElement.hasAttribute("xml:lang")) {
    // This is an XHTML file with a parsing error
    inLanguage = document.documentElement.getAttribute("xml:lang");
  } else if (document.documentElement.hasAttribute("lang")) {
    // HTML5 lang, could be XHTML5 or HTML5
    inLanguage = document.documentElement.getAttribute("lang");
  } else {
    // If we aren't in XML by now, the lang will be undefined
    inLanguage = document.documentElement.getAttributeNS(
      "http://www.w3.org/XML/1998/namespace",
      "lang"
    );
  }
  for (const node of window.document.querySelectorAll("[style]")) {
    try {
      const styles = await css(
        `body {${node.getAttribute("style")}}`,
        id,
        file
      );
      node.setAttribute("style", styles.split(/{|}/)[1]);
    } catch (err) {
      node.removeAttribute("style");
    }
  }
  for (const node of window.document.querySelectorAll("style")) {
    try {
      styles = styles.concat(await css(node.textContent, id, file));
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
        url: file.stylesheet(node.getAttribute("href")),
        encodingFormat: "text/css",
      });
      node.remove();
    }
    attributes(node, file, path);
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
    inLanguage,
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
