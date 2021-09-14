import { path } from "./base.js";
import mime from "mime";

const loadingFormats = ["application/xhtml+xml", "text/html", "text/css"];

export class Resource implements ResourceDescriptor {
  type = ["LinkedResource"];
  value?: Buffer | string;
  url: string;
  encodingFormat: string;
  id?: string;
  rel?: string[];
  inLanguage?: string;
  _meta?: {
    [key: string]: any;
  };
  constructor({
    value,
    url,
    encodingFormat,
    id,
    rel = [],
    _meta,
    inLanguage,
  }: ResourceDescriptor) {
    this.value = value;
    this.url = url;
    this.encodingFormat = encodingFormat;
    this.id = id;
    this.rel = rel;
    this._meta = _meta;
    this.inLanguage = inLanguage;
  }
  toJSON() {
    const json = { ...this };
    delete json.id;
    delete json._meta;
    return json;
  }
  attachment() {
    return !(
      this.encodingFormat.includes("image") ||
      loadingFormats.includes(this.encodingFormat)
    );
  }
}

export interface ResourceDescriptor {
  value?: Buffer | string;
  url: string;
  encodingFormat: string;
  id?: string;
  rel?: string[];
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
