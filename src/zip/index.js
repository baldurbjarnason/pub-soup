import { Base } from "./base.js";
import EventEmitter from "events";

export * from "./file.js";
export * from "./names.js";
export { Base } from "./base.js";

export class ZipFactory {
  constructor(env) {
    this.env = env;
  }

  get Archive() {
    return Zip;
  }

  async file(path) {
    return new this.Archive(await this.env.file(path), this.env);
  }

  async url(path) {
    return new this.Archive(await this.env.url(path), this.env);
  }

  async s3(s3Client, config) {
    return new this.Archive(await this.env.s3(s3Client, config), this.env);
  }

  async buffer(data) {
    return new this.Archive(await this.env.buffer(data), this.env);
  }
}

export class Zip extends EventEmitter {
  constructor(directory, env) {
    super();
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

  async dataFile(name) {
    const file = this.directory.files.find((d) => d.path === name);
    return file.buffer();
  }
}
