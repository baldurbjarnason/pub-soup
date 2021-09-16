import { ZipFactory } from "../zip/index.js";
import { Resource } from "../resource.js";
import { Epub } from "../epub/index.js";
import { getId } from "../id.js";
import { extractMeta, normalise } from "./extractMeta.js";

export class LpfFactory extends ZipFactory {
  get Archive() {
    return Lpf;
  }
}

export class InvalidPublicationError extends Error {
  name = "InvalidPublicationError";
  error?: Error;
  constructor(message, originalError: Error) {
    super(message);
    this.error = originalError;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class Lpf extends Epub {
  async metadata() {
    if (this._metadata) return this._metadata;
    let meta = await this.file("publication.json");
    try {
      if (!meta) {
        this._metadata = await extractMeta(
          this,
          await this.textFile("index.html")
        );
      } else {
        this._metadata = normalise(JSON.parse(meta.value), {
          base: "publication.json",
        });
      }
    } catch (err) {
      throw new InvalidPublicationError("Invalid Publication Metadata", err);
    }
    return this._metadata;
  }

  opf() {
    return null;
  }

  async resource(path: string) {
    if (
      path === "publication.json" &&
      this.directory.files.find((d) => d.path === "publication.json")
    ) {
      return new Resource({
        url: "publication.json",
        encodingFormat: "application/json",
      });
    } else if (
      path === "index.html" &&
      this.directory.files.find((d) => d.path === "index.html")
    ) {
      return new Resource({
        url: "index.html",
        encodingFormat: "text/html",
      });
    }
    const metadata = await this.metadata();
    const resource = metadata.resource(path);
    const encodingFormat = resource.encodingFormat;
    return new Resource({ encodingFormat, url: path });
  }
}
