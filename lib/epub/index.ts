import { Zip, ZipFactory } from "../zip/index.js";
import { Resource, ResourceDescriptor } from "../resource.js";
import { getId } from "../id.js";
import { opf } from "./opf.js";
import { purifyStyles } from "../css.js";
import { purify } from "../parsers/purify.js";
import { JSTYPES } from "../parsers/js-types.js";
import { getMarkup, view, getContents } from "./view.js";
import { Metadata, Publication } from "../metadata.js";

export function isTextFile(type) {
  if (
    type.includes("text") ||
    type.includes("xml") ||
    type.includes("script") ||
    type === "application/json"
  ) {
    return true;
  } else {
    return false;
  }
}

export class EpubFactory extends ZipFactory {
  get Archive() {
    return Epub;
  }
}

export class Epub extends Zip {
  wordCount: number;
  _metadata: Publication;
  constructor(directory, env) {
    super(directory, env);
  }

  async opf() {
    const meta = await this.file("META-INF/container.xml");
    const opfPath = meta.value.match(/full-path="([^"]+)"/)[1];
    return this.getFileForResource({
      url: opfPath,
      encodingFormat: "application/oebps-package+xml",
    });
  }
  async metadata() {
    await this.ensureMetadata();
    return this._metadata;
  }

  async ensureMetadata() {
    if (!this._metadata) {
      const file = await this.opf();
      const result = opf(file.value, file.url);
      this._metadata = result;
    }
  }

  async getFileForResource(resource: ResourceDescriptor) {
    let file;
    if (this.files[resource.url]) {
      file = this.files[resource.url];
    } else {
      file = new Resource({
        url: resource.url,
        encodingFormat: resource.encodingFormat,
        id: getId(resource.url),
        rel: [].concat(resource.rel),
      });
      if (isTextFile(resource.encodingFormat)) {
        file.value = await this.textFile(resource.url);
      } else {
        file.value = await this.dataFile(resource.url);
      }
      this.files[resource.url] = file;
    }
    return file;
  }

  async resource(path: string) {
    if (path === "mimetype") {
      return new Resource({
        url: "mimetype",
        encodingFormat: "text/plain",
      });
    } else if (path === "META-INF/container.xml") {
      return new Resource({
        url: "META-INF/container.xml",
        encodingFormat: "application/xml",
      });
    }
    const metadata = await this.metadata();
    const resource = metadata.resource(path);
    const encodingFormat = resource.encodingFormat;
    const id = getId(path);
    return new Resource({ encodingFormat, id, url: path });
  }

  async cover() {
    const metadata = await this.metadata();
    const coverResource = metadata.cover();
    return this.file(coverResource.url);
  }

  async file(path) {
    let file;
    if (this.files[path]) {
      file = this.files[path];
    } else if (!this.directory.files.find((d) => d.path === path)) {
      return null;
    } else {
      const resource = await this.resource(path);
      file = await this.getFileForResource(resource);
      if (file.encodingFormat === "text/css") {
        file.value = await purifyStyles(file.value, file);
      } else if (
        file.encodingFormat === "text/html" ||
        file.encodingFormat === "application/xhtml+xml" ||
        file.encodingFormat === "image/svg+xml"
      ) {
        file.value = await purify(file);
      } else if (JSTYPES.includes(file.encodingFormat)) {
        return null;
      }
      this.files[file.url] = file;
    }
    return file;
  }

  markup(filename) {
    return getMarkup(this, filename);
  }
  async contents() {
    return getContents(this, await this.metadata());
  }
  async view(config) {
    return view(this, config);
  }
}
