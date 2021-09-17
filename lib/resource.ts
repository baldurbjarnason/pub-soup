import { path } from "./base.js";
import mime from "mime";
import { getId } from "./id.js";
import { asArray } from "./utils/asArray.js";
import { asValue } from "./utils/asValue.js";

const loadingFormats = ["application/xhtml+xml", "text/html", "text/css"];

export class Resource implements ResourceDescriptor {
  type = ["LinkedResource"];
  value?: Buffer | string;
  url: string;
  encodingFormat: string;
  #id?: string;
  rel?: string[];
  inLanguage?: string;
  name?: string;
  #meta?: {
    [key: string]: any;
  };
  constructor({
    value,
    url,
    encodingFormat,
    rel = [],
    _meta,
    name,
    inLanguage,
  }: ResourceDescriptor) {
    this.value = value;
    this.url = url;
    this.encodingFormat = encodingFormat?.toLowerCase();
    this.#id = getId(url);
    this.rel = rel;
    this.#meta = _meta;
    if (name) {
      this.name = name;
    }
    this.inLanguage = inLanguage;
  }

  get(property) {
    return asArray(this.#meta[property]).map((value) => asValue(value));
  }

  getValue(property) {
    return this.get(property)[0].value;
  }

  id() {
    return this.#id;
  }
  attachment() {
    return !(
      this.encodingFormat?.startsWith("image/") ||
      loadingFormats.includes(this.encodingFormat)
    );
  }
  wordCount() {
    return this.#meta?.wordCount;
  }
  styles() {
    return this.#meta?.styles;
  }
}

export interface ResourceDescriptor {
  value?: Buffer | string;
  url: string;
  encodingFormat: string;
  originalId?: string;
  rel?: string[];
  name?: string;
  inLanguage?: string;
  _meta?: {
    [key: string]: any;
  };
}

export function asResource(resource, base = "index.html"): Resource {
  let updated;
  if (resource && resource.url && resource.encodingFormat) {
    updated = new Resource(resource);
  } else if (resource.url && !resource.encodingFormat) {
    const encodingFormat = mime.getType(resource.url);
    updated = new Resource({ ...resource, encodingFormat });
  } else if (typeof resource === "string") {
    const encodingFormat = mime.getType(resource);
    updated = new Resource({ url: path(resource, base), encodingFormat });
  } else {
    throw new Error("Resource expected, but got " + typeof resource);
  }
  return updated;
}
