import { chapterStyles } from "../css.js";
import { attributes } from "./attributes.js";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { count } from "@wordpress/wordcount";
import { shiftHeading } from "./headings.js";
import { ResourceDescriptor, Resource } from "../resource.js";
import { path } from "../base.js";

// Support srcset
const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ADD_TAGS: ["link"],
  FORBID_TAGS: ["meta", "form"],
  ADD_ATTR: ["my-attr"],
  FORBID_ATTR: ["action", "background", "poster"],
};

export async function markup(resource: ResourceDescriptor) {
  const { value, url, encodingFormat = "text/html", id, rel = [] } = resource;
  const wordCount = count(value as string, "words", {});
  let dom;
  try {
    dom = new JSDOM(value, {
      contentType: encodingFormat,
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
      const styles = await chapterStyles(
        `body {${node.getAttribute("style")}}`,
        id,
        resource
      );
      node.setAttribute("style", styles.split(/{|}/)[1]);
    } catch (err) {
      node.removeAttribute("style");
    }
  }
  let styles = [];
  for (const node of window.document.querySelectorAll(
    "style,link[rel='stylesheet']"
  )) {
    try {
      if (
        node.tagName === "link" &&
        path(node.getAttribute("href"), resource.url)
      ) {
        const link = {
          type: "LinkedResource",
          rel: ["stylesheet"],
          url: path(node.getAttribute("href"), url),
          id,
          encodingFormat: "text/css",
        };
        styles = styles.concat(link);
      } else {
        styles = styles.concat(
          await chapterStyles(node.textContent, id, resource)
        );
      }
    } catch (err) {}
    node.remove();
  }
  let title = "";
  if (window.document.querySelector("h1")) {
    title = window.document.querySelector("h1").textContent;
  } else if (window.document.querySelector("title")) {
    title = window.document.querySelector("title").textContent;
  }
  const headings = window.document.querySelectorAll("h1,h2,h3,h4,h5");
  for (const heading of headings) {
    shiftHeading(heading, window);
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
    attributes(node, resource);
  });
  DOMPurify.addHook("afterSanitizeElements", function (node) {
    if (node.tagName && node.tagName.toLowerCase() === "img") {
      node.setAttribute("loading", "lazy");
    }
  });
  DOMPurify.sanitize(window.document.documentElement, purifyConfig);
  let markupValue = "";
  if (window.document.documentElement.localName === "html") {
    const soupBody = window.document.createElement("soup-body");
    cloneAttributes(soupBody, window.document.body);
    soupBody.append(...window.document.body.childNodes);
    markupValue = soupBody.outerHTML;
  } else if (window.document.documentElement.localName === "svg") {
    markupValue = window.document.documentElement.outerHTML;
  }
  return new Resource({
    _meta: { styles, title, wordCount },
    url,
    value: markupValue,
    id,
    inLanguage,
    rel,
    encodingFormat: "text/html",
  });
}

function cloneAttributes(target, source) {
  [...source.attributes].forEach((attr) => {
    target.setAttribute(attr.nodeName, attr.nodeValue);
  });
}
