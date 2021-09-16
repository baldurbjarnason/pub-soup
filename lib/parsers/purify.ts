import { purifyStyles } from "../css.js";
import createDOMPurify from "dompurify";
import { JSDOM, VirtualConsole } from "jsdom";
import { ResourceDescriptor, Resource } from "../resource.js";
const virtualConsole = new VirtualConsole();

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ADD_TAGS: ["link"],
  FORBID_TAGS: ["meta", "form"],
  FORBID_ATTR: ["srcset", "action", "background", "poster"],
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

// In theory this should work for SVG images as well.
export async function purify(resource: Resource) {
  const { value, url, encodingFormat = "text/html" } = resource;
  const id = resource.id();
  let links = [id];
  let dom;
  try {
    dom = new JSDOM(value, {
      virtualConsole,
      contentType: encodingFormat,
      url: "http://localhost",
    });
  } catch (err) {
    // console.log(err);
    dom = new JSDOM(value, {
      virtualConsole,
      contentType: "text/html",
      url: "http://localhost",
    });
  }
  const window = dom.window;
  for (const node of window.document.querySelectorAll("[style]")) {
    try {
      const styles = await purifyStyles(
        `body {${node.getAttribute("style")}}`,
        resource
      );
      node.setAttribute("style", styles.split(/{|}/)[1]);
    } catch (err) {
      node.removeAttribute("style");
    }
  }
  for (const node of window.document.querySelectorAll("style")) {
    try {
      node.textContent = await purifyStyles(node.textContent, resource);
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
  const clean = DOMPurify.sanitize(
    window.document.documentElement,
    purifyConfig
  );
  return dom.serialize(clean);
}
