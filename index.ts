import { env, Env } from "./lib/env.js";
import { EpubFactory } from "./lib/epub/index.js";
import { ZipFactory } from "./lib/zip/index.js";
import { LpfFactory } from "./lib/lpf/index.js";
export { settings } from "./lib/env.js";
export { file, s3, url } from "./lib/filesystem/index.js";

export class Formats {
  env: Env;
  formats?: {
    [key: string]: ZipFactory;
  };
  constructor(env) {
    this.env = env;
    this.formats = {
      "application/zip": new ZipFactory(env),
      "application/epub+zip": new EpubFactory(env),
      "application/lpf+zip": new LpfFactory(env),
    };
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
