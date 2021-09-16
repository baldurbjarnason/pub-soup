import { Env } from "../env.js";
import EventEmitter from "events";
import { CentralDirectory } from "unzipper";
import mime from "mime";
import { Resource, ResourceDescriptor } from "../resource.js";
import { purifyStyles } from "../css.js";
import { purify } from "../parsers/purify.js";
import { JSTYPES } from "../parsers/js-types.js";

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
    return new Resource({ encodingFormat, url });
  }

  async getFileForResource(resource: ResourceDescriptor) {
    let file;
    if (this.files[resource.url]) {
      file = this.files[resource.url];
    } else {
      file = new Resource({
        url: resource.url,
        encodingFormat: resource.encodingFormat,
        rel: [].concat(resource.rel),
      });
      if (isTextFile(resource.encodingFormat)) {
        file.value = await this.textFile(resource.url);
      } else {
        file.value = await this.dataFile(resource.url);
      }
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
      this.files[resource.url] = file;
    }
    return file;
  }

  // Add a metadata method that creates a list of resources by mapping files and then sorting it by name.
  // If all the files are images or images and plain text files, then those are the reading order
  // If there are HTML files present, then those are the reading order.

  async file(path) {
    let file;
    if (this.files[path]) {
      file = this.files[path];
    } else if (!this.directory.files.find((d) => d.path === path)) {
      return null;
    } else {
      const resource = await this.resource(path);
      file = await this.getFileForResource(resource);
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
