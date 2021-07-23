import { EpubFactory, isTextFile } from "../src/epub/index.js";
import { once } from "events";
import { Base, Names } from "../src/zip/index.js";
import { env } from "../src/env.js";
import tap from "tap";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import * as path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace(process.cwd() + "/", "");

tap.test("Epub opf", async (test) => {
  function id() {
    return "id_";
  }

  const names = new Names(id);
  const testEnv = { ...env, names };
  const factory = new EpubFactory(testEnv);
  const epub = await factory.file("test.epub");
  test.ok(epub);
  epub.base = new epub.Base({ base: "http://test.example.com/" }, env);
  const opfFile = await epub.task("getOPF");
  test.equal(
    opfFile.value,
    await readFile(path.join(__dirname, "fixtures/output/test.opf"), {
      encoding: "utf8",
    })
  );
  test.equal(opfFile.path, "content.opf");
  const metadata = await epub.task("getMetadata", opfFile);
  test.same(metadata, {
    "@context": ["https://schema.org", "https://www.w3.org/ns/wp-context"],
    type: ["Book"],
    links: [],
    resources: [
      {
        url: "http://test.example.com/id_.xhtml",
        rel: [],
        encodingFormat: "application/xhtml+xml",
      },
      {
        url: "http://test.example.com/id_.xhtml",
        rel: [],
        encodingFormat: "application/xhtml+xml",
      },
      {
        url: "http://test.example.com/id_.css",
        rel: [],
        encodingFormat: "text/css",
      },
      {
        url: "http://test.example.com/id_.js",
        rel: [],
        encodingFormat: "text/javascript",
      },
      {
        url: "http://test.example.com/id_.ncx",
        rel: ["ncx"],
        encodingFormat: "application/x-dtbncx+xml",
      },
      {
        url: "http://test.example.com/id_.jpg",
        rel: ["cover"],
        encodingFormat: "image/jpeg",
      },
      {
        type: "LinkedResource",
        rel: ["alternate", "describedby"],
        url: "http://test.example.com/id_.opf",
        encodingFormat: "application/oebps-package+xml",
      },
    ],
    readingOrder: [
      {
        url: "http://test.example.com/id_.xhtml",
        rel: [],
        encodingFormat: "application/xhtml+xml",
      },
    ],
    inLanguage: "en",
    name: "ePub Experiment 1",
    id: "tag:baldur.bjarnason@gmail.com,2010-09:test/1",
    _epubVersion: "2.0",
    creator: [],
    publisher: ["Baldur Bjarnason"],
    author: ["Baldur Bjarnason"],
    translator: [],
    illustrator: [],
    editor: [],
    colorist: [],
    contributor: [],
  });
});

tap.test("Epub opf", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file("test.epub");
  test.ok(epub);
  epub.base = new epub.Base({ base: "http://test.example.com/" }, env);
  const opfFile = await epub.task("getOPF");
  await epub.task("getMetadata", opfFile);
  test.equal(epub.total, 9);
  test.equal(epub.total, 9);
});

tap.test("Epub contents", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const testEnv = { ...env, names };
  const factory = new EpubFactory(testEnv);
  const epub = await factory.file("test.epub");
  test.ok(epub);
  epub.base = new Base(
    {
      base: "http://test.example.com/",
      upload: "http://upload.example.com/",
    },
    { names }
  );
  const opfFile = await epub.task("getOPF");
  await epub.task("getMetadata", opfFile);
  const contents = await epub.task("contents");
  test.same(contents, {
    value: {
      type: "NCX",
      inLanguage: undefined,
      url: "content.ncx",
      children: [{ label: "This is a test", url: "test.xhtml", children: [] }],
      heading: "Test 1",
    },
    path: "content.ncx",
    base: epub.base,
    contentType: "application/json",
    id: "6_id",
    rel: [],
  });
});

tap.test("Epub textFile", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file("test.epub");
  const file = await zip.getTextFile({ url: "mimetype" });
  test.equal(file.value, "application/epub+zip");
});
tap.test("Epub error", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file("test.epub");
  process.nextTick(() => {
    zip.error(new Error("test"));
  });
  const err = await once(zip, "error");
  test.equal(err[0].message, "test");
});

tap.test("Epub isTextFile", async (test) => {
  test.ok(isTextFile("application/javascript"));
  test.ok(isTextFile("text/html"));
  test.ok(isTextFile("image/svg+xml"));
  test.notOk(isTextFile("image/jpeg"));
});

tap.test("Epub processTextFile simple", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file("test.epub");
  const file = await zip.processTextFile({ url: "mimetype" });
  test.equal(file.value, "application/epub+zip");
});

tap.test("Epub processTextFile js", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file("test.epub");
  const file = await zip.processTextFile({
    url: "modernizr-1.6.min.js",
    encodingFormat: "application/javascript",
  });
  test.notOk(file);
});

tap.test("Epub processBinaryFile simple", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file("test.epub");
  const file = await zip.processBinaryFile({ url: "mimetype" });
  test.equal(file.value.toString(), "application/epub+zip");
});

tap.test("Epub processBinaryFile js", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file("test.epub");
  const file = await zip.processBinaryFile({
    url: "modernizr-1.6.min.js",
    encodingFormat: "application/javascript",
  });
  test.notOk(file);
});

tap.test("Epub  processTextFile xhtml", async (test) => {
  const epub = await setupFile();
  const file = await epub.processTextFile({
    url: "test.xhtml",
    encodingFormat: "application/xhtml+xml",
  });
  test.equal(
    file.value,
    await readFile(path.join(__dirname, "fixtures/output/test.xhtml"), {
      encoding: "utf8",
    })
  );
});

tap.test("Epub  processTextFile css", async (test) => {
  const epub = await setupFile();
  const file = await epub.processTextFile({
    url: "style.css",
    encodingFormat: "text/css",
  });
  // await writeFile(path.join(__dirname, "fixtures/output/test.css"), file.value);
  test.equal(
    file.value,
    await readFile(path.join(__dirname, "fixtures/output/test.css"), {
      encoding: "utf8",
    })
  );
});

tap.test("Epub markup", async (test) => {
  const epub = await setupFile();
  const tasks = epub.markup();
  await tasks[0]();
  const file = epub.chapters[0];
  test.ok(file);
  // await writeFile(
  //   path.join(__dirname, "fixtures/output/markup.json"),
  //   JSON.stringify(file, null, 2)
  // );
  const output = JSON.parse(
    await readFile(path.join(__dirname, "fixtures/output/markup.json"), {
      encoding: "utf8",
    })
  );
  test.same(file, output);
});

tap.test("Epub uploads", async (test) => {
  const epub = await setupFile();
  function worker(promise) {
    return promise;
  }
  const tasks = epub.upload({ worker });
  test.equal(tasks.length, 7);
  const results = await Promise.all(tasks.map((task) => task()));
  const paths = results.map((result) => result && result.path);
  test.notOk(paths.filter((path) => path).find((path) => path.endsWith("js")));
});

tap.test("Epub process", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const testEnv = { ...env, names };
  const factory = new EpubFactory(testEnv);
  const epub = await factory.file("test.epub");
  async function worker(upload) {
    return upload;
  }
  const result = await epub.process({
    url: {
      base: "http://test.example.com/",
      upload: "http://upload.example.com/",
    },
    worker,
  });
  // await writeFile(
  //   path.join(__dirname, "fixtures/output/", result.path + ".json"),
  //   JSON.stringify(result.value, null, 2)
  // );
  test.same(
    result.value,
    JSON.parse(
      await readFile(
        path.join(
          __dirname,
          "fixtures/output/",
          path.basename(result.path) + ".json"
        ),
        {
          encoding: "utf8",
        }
      )
    )
  );
});

tap.test("Epub render", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const testEnv = { ...env, names };
  const factory = new EpubFactory(testEnv);
  const epub = await factory.file("test.epub");
  async function worker(upload) {
    return upload;
  }
  const result = await epub.render(
    {
      url: {
        base: "http://test.example.com/",
        upload: "http://upload.example.com/",
      },
      worker,
    },
    { stylesheets: ["style.css"] }
  );
  // await writeFile(
  //   path.join(__dirname, "fixtures/output/", "index.html"),
  //   result
  // );
  test.same(
    result,
    await readFile(path.join(__dirname, "fixtures/output/", "index.html"), {
      encoding: "utf8",
    })
  );
});
tap.test("Epub render 2", async (test) => {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const testEnv = { ...env, names };
  const factory = new EpubFactory(testEnv);
  const epub = await factory.file("test.epub");
  async function worker(upload) {
    return upload;
  }
  const result = await epub.render(
    {
      url: {
        base: "http://test.example.com/",
        upload: "http://upload.example.com/",
      },
      worker,
    },
    {
      description: "Test Epub file",
      cover: "/cover.jpeg",
      scriptHTML: "<script src='/script.js' module></script>",
      canonical: "https://canonical.example.com/",
      faviconMain: "https://www.example.com/favicon",
      faviconSVG: "https://www.example.com/favicon",
      manifestURL: "https://www.example.com/manifest",
      appleIcon: "https://www.example.com/appleIcon",
    }
  );
  // await writeFile(
  //   path.join(__dirname, "fixtures/output/", "index2.html"),
  //   result
  // );
  test.same(
    result,
    await readFile(path.join(__dirname, "fixtures/output/", "index2.html"), {
      encoding: "utf8",
    })
  );
});

// tap.test("Epub process error", async (test) => {
//   let counter = 0;

//   function id() {
//     counter = counter + 1;
//     return counter + "_id";
//   }

//   const names = new Names(id);
//   const testEnv = { ...env, names };
//   const factory = new EpubFactory(testEnv);
//   const epub = await factory.file("test.epub");
//   async function worker(upload) {
//     throw new Error("Uploads Failed!!!");
//   }
//   const iterator = epub.process({
//     url: {
//       base: "http://test.example.com/",
//       upload: "http://upload.example.com/",
//     },
//     worker,
//   });
//   for await (const result of iterator) {
//     // await writeFile(
//     //   path.join(__dirname, "fixtures/output/", result.path),
//     //   JSON.stringify(result.value, null, 2)
//     // );
//     test.same(
//       result.value,
//       JSON.parse(
//         await readFile(path.join(__dirname, "fixtures/output/", result.path), {
//           encoding: "utf8",
//         })
//       )
//     );
//   }
// });

async function setupFile() {
  let counter = 0;

  function id() {
    counter = counter + 1;
    return counter + "_id";
  }

  const names = new Names(id);
  const testEnv = { ...env, names };
  const factory = new EpubFactory(testEnv);
  const epub = await factory.file("test.epub");
  epub.base = new Base(
    {
      base: "http://test.example.com/",
      upload: "http://upload.example.com/",
    },
    { names }
  );
  const opfFile = await epub.task("getOPF");
  await epub.task("getMetadata", opfFile);
  return epub;
}
