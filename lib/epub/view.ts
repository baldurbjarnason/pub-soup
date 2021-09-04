import { Resource } from "../resource.js";
import { markup } from "../parsers/html.js";
import PQueue from "p-queue";
import { render } from "./render/render.js";
import { renderCSS } from "./render/renderCSS.js";
import { toc } from "./nav.js";

const chapterFormats = ["application/xhtml+xml", "text/html", "image/svg+xml"];

export async function getMarkup(epub, filename) {
  const file = await epub.file(filename);
  if (chapterFormats.includes(file.encodingFormat)) {
    return markup(file);
  } else {
    return null;
  }
}

export async function getContents(epub, metadata) {
  const resource = metadata.resources.find((resource) => {
    return !resource.rel.includes("contents") && resource.rel.includes("ncx");
  });
  const file = await epub.getFileForResource(resource);
  file.value = toc(file.value, file.url);
  file.encodingFormat = "application/json";
  file._meta = {
    title: file.value.heading,
  };
  return file;
}

export async function view(epub, { concurrency = 4 } = {}) {
  const metadata = await epub.metadata();
  epub.wordCount = 0;
  let chapters = [];
  const chapterTasks = metadata.resources
    .filter((resource) => {
      return chapterFormats.includes(resource.encodingFormat);
    })
    .map((resource) => {
      return async () => {
        const result = await epub.markup(resource.url);
        if (result._meta.wordCount) {
          epub.wordCount = epub.wordCount + result._meta.wordCount;
        }
        chapters = chapters.concat(result);
      };
    });

  const queue = new PQueue({ concurrency });
  let count = 0;
  queue.on("completed", () => {
    count = count + 1;
    epub.emit("progress", {
      completed: count,
      pending: queue.pending,
    });
  });
  await queue.addAll(chapterTasks);
  await queue.onEmpty();
  const contents = await getContents(epub, metadata);
  const main = await render(epub, { metadata, chapters, contents });
  const resource = new Resource({
    _meta: {
      publication: epub._metadata,
      wordCount: epub.wordCount,
      styles: await renderCSS(epub, main.styles, { concurrency }),
    },
    url: "index.html",
    encodingFormat: "text/html",
    value: main.body,
  });
  return resource;
}
