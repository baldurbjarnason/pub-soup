import { Base } from "./base.js";

export class ZipFactory {
  constructor(env) {
    this.env = env;
  }

  static get Archive() {
    return Zip;
  }

  static async file(path) {
    return new this.Archive(await this.env.unzipper.Open.file(path), this.env);
  }

  static async url(path) {
    return new this.Archive(
      await this.env.unzipper.Open.file(this.env.request, path),
      this.env
    );
  }

  static async s3(s3Client, config) {
    return new this.Archive(
      await this.env.unzipper.Open.s3(s3Client, config),
      this.env
    );
  }

  static async buffer(data) {
    return new this.Archive(
      await this.env.unzipper.Open.buffer(data),
      this.env
    );
  }
}

export class Zip {
  constructor(directory, env) {
    this.directory = directory;
    this.files = {};
    this.names = env.names;
    this.Base = Base;
    this.env = env;
  }

  async textFile(name) {
    const file = this.directory.files.find((d) => d.path === name);
    const content = await file.buffer();
    return content.toString();
  }

  async datafile(name) {
    const file = this.directory.files.find((d) => d.path === name);
    return file.buffer();
  }
}

export class File {
  constructor({ value, path, base, contentType, id }) {
    this.value = value;
    this.path = path;
    this.base = base;
    this.contentType = contentType;
    this.id = id;
  }

  src(path) {
    return this.base.transform(path, this.path, "media");
  }

  srcset(path) {
    return this.base.srcset(path, this.path);
  }

  href(path) {
    return this.base.transform(path, this.path, "link");
  }

  stylesheet(path) {
    return this.base.transform(path, this.path, "style");
  }
}
