import { Zip, ZipFactory } from "../zip/index.js";
import { Resource } from "../resource.js";
import { opf } from "./opf.js";

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
  constructor(directory, env) {
    super(directory, env);
  }

  async opf() {
    const meta = await this.file("META-INF/container.xml");
    const opfPath = meta.value.match(/full-path="([^"]+)"/)[1];
    return this.fileForResource({
      url: opfPath,
      encodingFormat: "application/oebps-package+xml",
    });
  }
  async ensureMetadata() {
    if (!this._metadata) {
      const file = await this.opf();
      const result = opf(file.value, file.url);
      this._metadata = result;
    }
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
    return resource;
  }
}
