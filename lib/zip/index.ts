import { Env } from "../env.js";
import EventEmitter from "events";
import { CentralDirectory } from "unzipper";
import mime from "mime";
import { Resource, ResourceDescriptor } from "../resource.js";
import { getId } from "../id.js";

export class ZipFactory {
  env: Env;
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
  directory: CentralDirectory;
  env: Env;
  files: {
    [key: string]: ResourceDescriptor;
  };
  constructor(directory, env) {
    super();
    this.directory = directory;
    this.files = {};
    this.env = env;
  }

  async resource(url: string) {
    const encodingFormat = mime.getType(url);
    const id = getId(url);
    return new Resource({ encodingFormat, id, url });
  }

  async file(path) {
    const file = await this.resource(path);
    if (isTextFile(file.encodingFormat)) {
      file.value = await this.textFile(path);
    } else {
      file.value = await this.dataFile(path);
    }
    return file;
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

function isTextFile(type) {
  if (
    type?.includes("text") ||
    type?.includes("xml") ||
    type?.includes("script")
  ) {
    return true;
  } else {
    return false;
  }
}
