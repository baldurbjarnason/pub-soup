import { Zip, ZipFactory, File } from "../zip/index.js";
import { opf } from "./opf.js";
import { markup } from "../parsers/markup.js";
import PQueue from "p-queue";
import { toc } from "./nav.js";
import { css, uploads } from "../css.js";
import { purify } from "../parsers/dompurify.js";
import { stringify } from "./stringify/stringify.js";
import { toJSON } from "../metadata.js";
import { renderCSS } from "./stringify/stylesheets.js";
import { JSTYPES } from "../parsers/js-types.js";
import { render } from "../templates/index.js";

export function isTextFile(type) {
  if (
    type.includes("text") ||
    type.includes("xml") ||
    type.includes("script")
  ) {
    return true;
  } else {
    return false;
  }
}

export class EpubFactory extends ZipFactory {
  get Archive() {
    return Epub;
  }
}

export class Epub extends Zip {
  constructor(directory, env) {
    super(directory, env);
    this.styles = [];
    this.chapters = [];
  }

  error(err) {
    this.emit("error", err);
  }

  task(method, ...arg) {
    return this[method](...arg).catch((err) => this.error(err));
  }

  async getOPF() {
    const meta = await this.getTextFile({ url: "META-INF/container.xml" });
    const opfPath = meta.value.match(/full-path="([^"]+)"/)[1];
    return this.getTextFile({ url: opfPath });
  }

  // In multi-file sitations, the API consumer should dynamically add the main URL after the fact if it wants to use the multi-page version. (Which is broken because of CSS)
  //
  // Convert original OPF to use new urls?
  //
  // Extract start position. Meaningless in a single page?
  async getMetadata(base) {
    await this.setMetadata();
    if (base) {
      this.setupBase(base);
    }
    return toJSON(this);
  }

  setupBase(base) {
    this.base = new this.Base(base, this.env);
  }

  async setMetadata() {
    if (!this._metadata) {
      const file = await this.task("getOPF");
      const result = opf(file.value, file.path);
      this._metadata = result;
    }
  }

  async getTextFile(resource) {
    let file;
    if (this.files[resource.url]) {
      file = this.files[resource.url];
    } else {
      file = new File({
        value: await this.textFile(resource.url),
        path: resource.url,
        contentType: resource.encodingFormat,
        base: this.base,
        id: this.names.id(resource.url),
        rel: [].concat(resource.rel),
      });
      this.files[resource.url] = file;
    }
    return file;
  }

  async getBinaryFile(resource) {
    let file;
    if (this.files[resource.url]) {
      file = this.files[resource.url];
    } else {
      file = new File({
        value: await this.dataFile(resource.url),
        path: resource.url,
        contentType: resource.encodingFormat,
        base: this.base,
        id: this.names.id(resource.url),
        rel: [].concat(resource.rel),
      });
      this.files[resource.url] = file;
    }
    return file;
  }

  async getContents() {
    const resource = this._metadata.resources.find((resource) => {
      return !resource.rel.includes("contents") && resource.rel.includes("ncx");
    });
    const file = await this.getTextFile(resource);
    this._contents = new File({
      value: toc(file.value, file.path),
      path: resource.url,
      contentType: "application/json",
      base: this.base,
      id: this.names.id(resource.url),
    });
    return this._contents;
  }

  get total() {
    if (!this._htmlCount) {
      this._htmlCount = this._metadata.resources.filter((resource) => {
        return (
          resource.encodingFormat === "application/xhtml+xml" ||
          resource.encodingFormat === "text/html"
        );
      }).length;
    }
    return this._htmlCount + this._metadata.resources.length;
  }

  async processMarkup(resource) {
    const file = await this.getTextFile(resource);
    const result = await markup(file);
    this.chapters.push(result);
    return result;
  }

  async getCover() {
    if (!this._metadata) {
      await this.setMetadata();
    }
    const coverResource = this._metadata.resources.find((resource) =>
      resource.rel.includes("cover")
    );
    return this.processBinaryFile(coverResource);
  }

  markup() {
    const chapterTasks = this._metadata.resources
      .filter((resource) => {
        return (
          resource.encodingFormat === "application/xhtml+xml" ||
          resource.encodingFormat === "text/html"
        );
      })
      .map((resource) => {
        return () => {
          return this.task("processMarkup", resource);
        };
      });
    return chapterTasks;
  }

  async processTextFile(resource) {
    const file = await this.getTextFile(resource);
    if (file.contentType === "text/css") {
      file.path = this.names.get(file.path);
      const embed = Object.assign({}, file);
      embed.value = await css(file.value, file.path, file);
      embed.path = this.base.upload(embed.path);
      this.styles = this.styles.concat(embed);
      file.value = await uploads(file.value, file.path, file);
      return file;
    } else if (
      file.contentType === "text/html" ||
      file.contentType === "application/xhtml+xml" ||
      file.contentType === "image/svg+xml"
    ) {
      file.value = await purify(file);
      file.path = this.names.get(file.path);
      return file;
    } else if (!JSTYPES.includes(file.contentType)) {
      file.path = this.names.get(file.path);
      return file;
    }
  }

  async processBinaryFile(resource) {
    const file = await this.getBinaryFile(resource);
    if (!JSTYPES.includes(file.contentType)) {
      file.path = this.names.get(file.path);
      return file;
    }
  }

  upload({ worker }) {
    const uploads = this._metadata.resources.map((resource) => {
      return async () => {
        let task;
        if (isTextFile(resource.encodingFormat)) {
          task = this.task("processTextFile", resource);
        } else {
          task = this.task("processBinaryFile", resource);
        }
        return task.then((result) => {
          if (result) return worker(result);
        });
      };
    });
    return uploads;
  }

  async getWordCount() {
    this._metadata.resources = this._metadata.resources.map((resource) => {
      const markup = this.chapters.find(
        (chapter) => chapter.path === resource.url
      );
      if (markup) {
        resource.wordcount = markup.wordcount;
      }
      return resource;
    });
    this._metadata.wordcount = this._metadata.readingOrder.reduce(
      (accumulator, current) => {
        const { wordcount = 0 } = this.chapters.find(
          (chapter) => chapter.path === current.url
        );
        return accumulator + wordcount;
      },
      0
    );
  }

  async render(config, data = {}) {
    const file = await this.process(config);
    const context = Object.assign({}, file, data);
    context.metadata = file.value.metadata;
    return render(context);
  }

  async process({ url, concurrency = 8, worker = () => {} }) {
    this.base = new this.Base(url, this.env);
    const opfResult = await this.task("getMetadata");
    await this.task("getContents");
    const queue = new PQueue({ concurrency });
    let count = 0;
    queue.on("completed", () => {
      count = count + 1;
      this.emit("progress", {
        completed: count,
        total: this.total,
        pending: queue.pending,
      });
    });
    await queue.addAll(this.markup());
    const file = new File({
      path: this.base.transform("index.html", "index.html", "upload"),
      base: this.base,
      contentType: "text/html",
      metadata: opfResult,
    });
    queue.addAll(this.upload({ worker }));
    await queue.onEmpty();
    await this.task("getWordCount");
    const main = stringify(this);
    main.styles = await renderCSS(this);
    main.metadata = opfResult;
    file.value = main;
    return file;
  }
}
