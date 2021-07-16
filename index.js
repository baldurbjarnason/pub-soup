import { env } from "./src/env.js";
import { EpubFactory } from "./src/epub/index.js";
import { ZipFactory } from "./src/zip.js";

export class Formats {
  constructor(env) {
    this.env = env;
    this.formats = {
      "application/zip": new ZipFactory(env),
      "application/epub+zip": new EpubFactory(env),
    };
  }

  use(mediaType, handler) {
    this.formats[mediaType] = handler;
  }

  file(mediaType, path) {
    if (this.formats[mediaType]) return this.formats[mediaType].file(path);
  }

  url(mediaType, path) {
    if (this.formats[mediaType]) return this.formats[mediaType].url(path);
  }

  s3(mediaType, s3Client, config) {
    if (this.formats[mediaType])
      return this.formats[mediaType].s3(s3Client, config);
  }

  buffer(mediaType, data) {
    if (this.formats[mediaType]) return this.formats[mediaType].buffer(data);
  }
}

export const formats = new Formats(env);
