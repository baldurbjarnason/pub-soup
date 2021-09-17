import { Env } from "../env.js";
import EventEmitter from "events";
import { CentralDirectory } from "unzipper";
import mime from "mime";
import { Resource, ResourceDescriptor } from "../resource.js";
import { purifyStyles } from "../css.js";
import { purify } from "../parsers/purify.js";
import { JSTYPES } from "../parsers/js-types.js";
import { Publication } from "../metadata.js";
import { extractZipMeta } from "./zip-metadata.js";
import { getMarkup, view, getContents } from "../view/index.js";

export class ZipFactory {
  env: Env;
  constructor(env) {
    this.env = env;
  }

  get Archive() {
    return Zip;
  }

  async file(path, options?, env = this.env) {
    const archive = new this.Archive(await this.env.file(path), env);
    archive.url = path;
    return archive;
  }

  async url(path, options?, env = this.env) {
    const archive = new this.Archive(await this.env.url(path), env);
    archive.url = path;
    return archive;
  }

  async s3(s3Client, config, env = this.env) {
    const archive = new this.Archive(await this.env.s3(s3Client, config), env);
    archive.url = config.key;
    return archive;
  }

  async buffer(data, path?, env = this.env) {
    const archive = new this.Archive(await this.env.buffer(data), env);
    archive.url = path;
    return archive;
  }
}

export class Zip extends EventEmitter {
  directory: CentralDirectory;
  env: Env;
  files: {
    [key: string]: ResourceDescriptor;
  };
  _metadata: Publication;
  url?: string;
  constructor(directory, env) {
    super();
    this.directory = directory;
    this.files = {};
    this.env = env;
  }
  async metadata() {
    await this.ensureMetadata();
    return this._metadata;
  }

  async ensureMetadata() {
    if (!this._metadata) {
      this._metadata = await extractZipMeta(this);
    }
  }

  async resource(url: string) {
    const metadata = await this.metadata();
    return metadata.resource(url);
  }

  async fileForResource(resource: ResourceDescriptor) {
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
      file = await this.fileForResource(resource);
    }
    return file;
  }

  streamForResource({ url }) {
    if (!this.directory.files.find((d) => d.path === url)) return null;
    const file = this.directory.files.find((d) => d.path === url);
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

  async cover() {
    const metadata = await this.metadata();
    const coverResource = metadata.cover();
    return this.file(coverResource.url);
  }
  async image() {
    const metadata = await this.metadata();
    const imageResource = metadata.image();
    return this.fileForResource(imageResource);
  }
  markup(filename) {
    return getMarkup(this, filename);
  }
  async contents() {
    return getContents(this, await this.metadata());
  }
  async view(config) {
    return view(this, config);
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
