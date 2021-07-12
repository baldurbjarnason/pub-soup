import { css } from "./css.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const validDataUrl = require("valid-data-url");

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ADD_TAGS: ["link"],
  FORBID_TAGS: ["meta", "form"],
  FORBID_ATTR: ["srcset", "action", "background", "poster"],
};

// In theory this should work for SVG images as well.
export async function purify(chapter, chapterPath, contentType = "text/html") {
  const resourceURL = new URL(chapterPath, "https://example.com/");
  let dom;
  try {
    dom = new JSDOM(chapter, {
      contentType,
      url: "http://localhost",
    });
  } catch (err) {
    dom = new JSDOM(chapter, {
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
      node.textContent = await css(node.textContent, resourceURL.href);
    } catch (err) {
      node.textContent = "";
    }
  }
  const DOMPurify = createDOMPurify(window);
  // Based on sample from https://github.com/cure53/DOMPurify/tree/master/demos, same license as DOMPurify

  DOMPurify.addHook("uponSanitizeElement", function (node, data) {
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
    // All src urls must be relative. This will have to be improved once we start expanding our format support
    if (
      node.hasAttribute("src") &&
      !testPath(node.getAttribute("src"), resourceURL) &&
      !validDataUrl(node.getAttribute("src"))
    ) {
      node.remove();
    }
    if (
      node.tagName.toLowerCase() === "link" &&
      node.hasAttribute("href") &&
      node.getAttribute("rel") === "stylesheet" &&
      !testPath(node.getAttribute("href"), resourceURL)
    ) {
      node.remove();
    }
  });
  const clean = DOMPurify.sanitize(
    window.document.documentElement,
    purifyConfig
  );
  return dom.serialize(clean);
}

function testPath(path, resourceURL) {
  const base = new URL(resourceURL, "http://example.com");
  const url = new URL(path, base);
  // If the hostname doesn't equal that of the base URL we provided, then it is a full URL and so not supported
  return url.hostname === base.hostname;
}
