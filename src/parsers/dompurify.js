import { uploads } from "../css.js";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { src } from "./attributes.js";
import validDataUrl from "valid-data-url";

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ADD_TAGS: ["link"],
  FORBID_TAGS: ["meta", "form"],
  FORBID_ATTR: ["srcset", "action", "background", "poster"],
};

function href(node, file) {
  const { base, path } = file;
  if (
    node.hasAttribute("href") &&
    !validDataUrl(node.getAttribute("href")) &&
    !node.getAttribute("href").startsWith("#")
  ) {
    node.setAttribute(
      "href",
      base.transform(node.getAttribute("href"), path, "media")
    );
  }
  // then there is xlink:href on images
  if (
    node.getAttributeNS("http://www.w3.org/1999/xlink", "href") &&
    !validDataUrl(
      node.getAttributeNS("http://www.w3.org/1999/xlink", "href")
    ) &&
    !node.getAttributeNS("http://www.w3.org/1999/xlink", "href").startsWith("#")
  ) {
    node.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      base.transform(
        node.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
        path,
        "media"
      )
    );
  }
}

// In theory this should work for SVG images as well.
export async function purify(file) {
  const { value, path, contentType = "text/html", id, base } = file;
  let links = [id];
  let dom;
  try {
    dom = new JSDOM(value, {
      contentType,
      url: "http://localhost",
    });
  } catch (err) {
    console.log(err);
    dom = new JSDOM(value, {
      contentType: "text/html",
      url: "http://localhost",
    });
  }
  const window = dom.window;
  for (const node of window.document.querySelectorAll("[style]")) {
    try {
      const styles = await uploads(
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
      node.textContent = await uploads(node.textContent, id, file);
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
    if (
      node.tagName.toLowerCase() === "link" &&
      node.hasAttribute("href") &&
      node.getAttribute("rel") === "stylesheet" &&
      !base.full(node.getAttribute("href"), path)
    ) {
      node.remove();
    } else if (
      node.tagName.toLowerCase() === "link" &&
      node.hasAttribute("href") &&
      node.getAttribute("rel") === "stylesheet" &&
      base.full(node.getAttribute("href"), path)
    ) {
      links = links.concat(file.stylesheet(node.getAttribute("href")));
    }
    src(node, file);
    href(node, file);
  });
  const clean = DOMPurify.sanitize(
    window.document.documentElement,
    purifyConfig
  );
  window.document.documentElement.dataset.stylesheets = links.join(" ");
  return dom.serialize(clean);
}
