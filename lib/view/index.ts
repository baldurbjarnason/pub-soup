import { Resource } from "../resource.js";
import { markup } from "../parsers/html.js";
import PQueue from "p-queue";
import { render } from "./render/render.js";
import { toc } from "./nav.js";
import { renderCSS } from "./render/renderCSS.js";

const chapterFormats = ["application/xhtml+xml", "text/html", "image/svg+xml"];

export async function getMarkup(epub, filename) {
  const file = await epub.file(filename);
  if (chapterFormats.includes(file.encodingFormat)) {
    return markup(file);
  } else {
    // We need to also support audio, video, and bitmap image chapters.
    return null;
  }
}

export async function getContents(epub, metadata) {
  const [contents] = metadata.relation("contents");
  const [ncx] = metadata.relation("ncx");
  const resource = contents || ncx;
  const file = await epub.getFileForResource(resource);
  file.value = toc(file.value, file.url);
  file.encodingFormat = "application/json";
  file.name = file.value.heading;
  file.rel = file.rel.concat("contents");
  return file;
}

export async function view(epub, { concurrency = 4 } = {}) {
  const metadata = await epub.metadata();
  epub.wordCount = 0;
  let chapters = [];
  const chapterTasks = metadata.chapters().map((resource) => {
    return async () => {
      const result = await epub.markup(resource.url);
      if (result.wordCount()) {
        epub.wordCount = epub.wordCount + result.wordCount();
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
      publication: metadata,
      wordCount: epub.wordCount,
      styles: await renderCSS(epub, main.styles, { concurrency }),
    },
    inLanguage: metadata.inLanguage,
    url: "index.html",
    encodingFormat: "text/html",
    value: main.body,
  });
  return resource;
}
