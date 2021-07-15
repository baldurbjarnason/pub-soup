import { Base } from "./base.js";
import EventEmitter from "events";

export class ZipFactory extends EventEmitter {
  constructor(env) {
    super();
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

  async dataFile(name) {
    const file = this.directory.files.find((d) => d.path === name);
    return file.buffer();
  }
}
