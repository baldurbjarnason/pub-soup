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

  // Add a metadata method that creates a list of resources by mapping files and then sorting it by name.
  // If all the files are images or images and plain text files, then those are the reading order
  // If there are HTML files present, then those are the reading order.

  async file(path) {
    if (!this.directory.files.find((d) => d.path === path)) return null;
    const file = await this.resource(path);
    if (isTextFile(file.encodingFormat)) {
      file.value = await this.textFile(path);
    } else {
      file.value = await this.dataFile(path);
    }
    return file;
  }

  stream(path) {
    if (!this.directory.files.find((d) => d.path === path)) return null;
    const file = this.directory.files.find((d) => d.path === path);
    return file.stream();
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
    type?.startsWith("text/") ||
    type?.includes("xml") ||
    type?.startsWith("script/") ||
    type === "application/json" ||
    type === "application/ld+json"
  ) {
    return true;
  } else {
    return false;
  }
}
