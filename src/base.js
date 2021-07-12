import { Names } from "./names.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const srcset = require("srcset");

export class Base {
  constructor({ media, link, style, base } = {}, { names = new Names() } = {}) {
    base = base || "http://www.example.com/";
    this.url = {
      base: base,
      media: media || base,
      link: link || base,
      style: style || base,
    };
    this.names = names;
  }

  // What this does is return a full zip path if the path refers to an in-archive file or null if it does not
  full(path, fileBase) {
    const baseURL = new URL(fileBase, "https://www.example.com/");
    const absoluteURL = new URL(path, baseURL);
    if (absoluteURL.host !== "www.example.com") {
      return null;
    } else {
      return absoluteURL.pathname.replace("/", "");
    }
  }

  transform(path, fileBase, type) {
    const full = this.full(path, fileBase);
    let id;
    if (full && type === "link") {
      id = this.names.get(full);
      // We ignore query parameters for internal references.
      const hash = new URL(
        path,
        new URL(fileBase, "https://www.example.com/")
      ).hash.replace("#", "");
      return hash ? `#${id}:${hash}` : `#${id}`;
    } else if (full && this[type]) {
      id = this.names.get(full);
      return this[type](id);
    } else {
      // This isn't a url for something in the archive so we just return it as is.
      return path;
    }
  }

  srcset(set, fileBase) {
    const parsed = srcset.parse(set);
    for (const src of parsed) {
      src.url = this.transform(src.url, fileBase, "media");
    }
    return srcset.stringify(parsed);
  }

  id(hash, fileBase) {
    return `${this.names.get(fileBase)}:${hash}`;
  }

  href(url) {
    return this.serialize(new URL(url, this.url.base));
  }

  serialize(url = new URL(this.url.base)) {
    if (url.hostname === "www.example.com") {
      return url.pathname;
    } else {
      return url.href;
    }
  }

  media(url) {
    return this.serialize(new URL(url, this.url.media));
  }

  link(url) {
    return this.serialize(new URL(url, this.url.link));
  }

  style(url) {
    return this.serialize(new URL(url, this.url.style));
  }
}
