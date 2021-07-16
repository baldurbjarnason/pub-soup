import { Zip, ZipFactory, File } from "../zip/index.js";
import { opf } from "./opf.js";
import { markup } from "../parsers/markup.js";
import PQueue from "p-queue";
import { toc } from "./nav.js";
import { css } from "../css.js";
import { purify } from "../parsers/dompurify.js";
import { stringify } from "./stringify/stringify.js";
import { toJSON } from "../metadata.js";

const JSTYPES = [
  "text/javascript",
  "text/ecmascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-javascript",
  "text/x-ecmascript",
  "application/x-javascript",
  "application/x-ecmascript",
  "application/javascript",
  "application/ecmascript",
];

function isTextFile(type) {
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
  error(err) {
    this.emit("error", err);
  }

  task(method, ...arg) {
    return this[method](...arg).catch((err) => this.error(err));
  }

  async getOPF() {
    const meta = await this.textFile("META-INF/container.xml");
    const opfPath = meta.match(/full-path="([^"]+)"/)[1];
    this.files[opfPath] = new File({
      value: await this.textFile(opfPath),
      path: opfPath,
      base: this.base,
      id: this.names.get(opfPath),
    });
    return this.files[opfPath];
  }

  // In multi-file sitations, the API consumer should dynamically add the main URL after the fact if it wants to use the multi-page version. (Which is broken because of CSS)
  //
  // Convert original OPF to use new urls?
  //
  // Extract start position. Meaningless in a single page?
  async opf(file) {
    this.metadata = opf(file.value, file.path);
    return toJSON(this);
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
    }
    return file;
  }

  async contents() {
    const resource = this.metadata.resources.find((resource) => {
      !resource.rel.includes("contents") && resource.rel.includes("ncx");
    });
    const file = await this.getTextFile(resource);
    this.contents = new File({
      value: toc(file.value, file.path),
      path: resource.url,
      contentType: "application/json",
      base: this.base,
      id: this.names.id(resource.url),
    });
    return this.contents;
  }

  get total() {
    if (!this.htmlCount) {
      this.htmlCount = this.metadata.resources.filter((resource) => {
        return (
          resource.encodingFormat === "application/xhtml+xml" ||
          resource.encodingFormat === "text/html"
        );
      }).length;
    }
    return this.htmlCount + this.metadata.resources.length;
  }

  async processMarkup(resource) {
    const file = await this.getTextFile(resource);
    return markup(file);
  }

  markup() {
    const chapterTasks = this.metadata.resources
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
      file.value = css(file.value, file.path, file);
      return file;
    } else if (
      file.contentType === "text/html" ||
      file.contentType === "application/xhtml+xml" ||
      file.contentType === "image/svg+xml"
    ) {
      file.value = purify(file);
      file.path = this.names.get(file.path);
      return file;
    } else if (!JSTYPES.includes(file.contentType)) {
      file.path = this.names.get(file.path);
      return file;
    }
  }

  async processBinaryFile(resource) {
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
    }
    if (!JSTYPES.includes(file.contentType)) {
      file.path = this.names.get(file.path);
      return file;
    }
  }

  async upload({ worker }) {
    const uploads = this.metadata.resources.map((resource) => {
      return async () => {
        if (isTextFile(resource.encodingFormat)) {
          return worker(await this.task("processTextFile", resource));
        } else {
          return worker(await this.task("processBinaryFile", resource));
        }
      };
    });
    return uploads;
  }
}

Epub.prototype.process = async function* process({
  url,
  concurrency = 8,
  worker = () => {},
}) {
  this.base = new this.Base(url, this.env);
  const opfFile = await this.task("getOPF");
  worker(opfFile);
  yield this.task("opf", opfFile);
  await this.task("contents");
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
  queue.on("error", (err) => {
    this.error(err);
  });
  await queue.addAll(this.markup());
  const main = stringify(this);
  const file = new File({
    value: main,
    path: this.names.get("index.html"),
    base: this.base,
    contentType: "text/html",
  });
  yield file;
  queue.addAll(this.upload({ worker }));
  return queue.onEmpty();
};
