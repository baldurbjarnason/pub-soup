import { EpubFactory, isTextFile } from "../dist/lib/epub/index.js";
// import { once } from "events";
import { env } from "../dist/lib/env.js";
import tap from "tap";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import * as path from "path";
// import { Resource } from "../dist/lib/resource.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace(process.cwd() + "/", "");

const EPUB = "tests/fixtures/test.epub";

tap.test("Epub opf", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  test.ok(epub);
  const opfFile = await epub.opf();
  test.equal(
    opfFile.value,
    await readFile(path.join(__dirname, "fixtures/output/test.opf"), {
      encoding: "utf8",
    })
  );
  test.equal(opfFile.url, "content.opf");
  const metadata = await epub.metadata();
  // await writeFile(
  //   path.join(__dirname, "fixtures/output/metadata.json"),
  //   JSON.stringify(metadata, null, 2)
  // );
  test.same(
    JSON.parse(JSON.stringify(metadata)),
    JSON.parse(
      await readFile(
        path.join(__dirname, "fixtures/output/metadata.json"),
        "utf-8"
      )
    )
  );
});

tap.test("Epub opf 2", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  test.ok(epub);
  const opfFile = await epub.opf();
  test.equal(
    opfFile.value,
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="dcidid" version="2.0">
	<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
		<dc:title>ePub Experiment 1</dc:title>
		<dc:creator opf:role="aut" opf:file-as="Bjarnason, Baldur">Baldur Bjarnason</dc:creator>
		<dc:date>2010-10-27</dc:date>
		<dc:subject>Something</dc:subject>
		<dc:identifier id="dcidid" opf:scheme="URI">tag:baldur.bjarnason@gmail.com,2010-09:test/1</dc:identifier>
		<dc:language>en</dc:language>
		<dc:description></dc:description>
      	<dc:publisher>Baldur Bjarnason</dc:publisher>
		<meta name="cover" content="image1" />
	</metadata>
	<manifest>
		<item id="test" href="test.xhtml" media-type="application/xhtml+xml"/>
		<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
		<item id="stylesheet" href="style.css" media-type="text/css"/>
    	<item id="script" href="modernizr-1.6.min.js" media-type="text/javascript"/>
		<item id="ncx" href="content.ncx" media-type="application/x-dtbncx+xml"/>
   		<item id="image1" href="cover.jpg" media-type="image/jpeg" />
	</manifest>
	<spine toc="ncx">
		<itemref idref="cover" linear="no"/>
		<itemref idref="test" linear="yes"/>
	</spine>
	<guide>
    	<reference type="cover" title="Cover" href="cover.xhtml"/>
    </guide>
</package>
`
  );
});

tap.test("Epub contents", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  test.ok(epub);
  const contents = await epub.contents();
  test.same(contents, {
    type: ["LinkedResource"],
    value: {
      type: "NCX",
      inLanguage: undefined,
      url: "content.ncx",
      children: [{ label: "This is a test", url: "test.xhtml", children: [] }],
      heading: "Test 1",
    },
    url: "content.ncx",
    id: "idY29udGVudC5uY3g",
    encodingFormat: "application/json",
    rel: ["ncx", "contents"],
    name: "Test 1",
    inLanguage: undefined,
  });
});

tap.test("Epub textFile", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file(EPUB);
  const file = await zip.getFileForResource({
    url: "mimetype",
    encodingFormat: "text/plain",
  });
  test.equal(file.value, "application/epub+zip");
});

// tap.test("Epub error", async (test) => {
//   const factory = new EpubFactory(env);
//   const zip = await factory.file(EPUB);
//   process.nextTick(() => {
//     zip.error(new Error("test"));
//   });
//   const err = await once(zip, "error");
//   test.equal(err[0].message, "test");
// });

tap.test("Epub isTextFile", async (test) => {
  test.ok(isTextFile("application/javascript"));
  test.ok(isTextFile("text/html"));
  test.ok(isTextFile("image/svg+xml"));
  test.notOk(isTextFile("image/jpeg"));
});

// tap.test("Epub processTextFile simple", async (test) => {
//   const factory = new EpubFactory(env);
//   const zip = await factory.file(EPUB);
//   const file = await zip.processTextFile({ url: "mimetype" });
//   test.equal(file.value, "application/epub+zip");
// });

tap.test("Epub file js", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file(EPUB);
  const file = await zip.file("modernizr-1.6.min.js");
  test.notOk(file);
});
tap.test("Epub file nonexistent", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file(EPUB);
  const file = await zip.file("bloopbloop.fingle");
  test.notOk(file);
});

tap.test("Epub markup not a chapter", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file(EPUB);
  const file = await zip.markup("cover.jpg");
  test.notOk(file);
});

tap.test("Epub file binary simple", async (test) => {
  const factory = new EpubFactory(env);
  const zip = await factory.file(EPUB);
  const file = await zip.file("mimetype");
  test.equal(file.value.toString(), "application/epub+zip");
});

// tap.test("Epub processBinaryFile js", async (test) => {
//   const factory = new EpubFactory(env);
//   const zip = await factory.file(EPUB);
//   const file = await zip.processBinaryFile({
//     url: "modernizr-1.6.min.js",
//     encodingFormat: "application/javascript",
//   });
//   test.notOk(file);
// });

tap.test("Epub  file xhtml", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  const file = await epub.file("test.xhtml");
  test.equal(
    file.value,
    await readFile(path.join(__dirname, "fixtures/output/test.xhtml"), {
      encoding: "utf8",
    })
  );
});

tap.test("Epub  cover", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  const file = await epub.cover();
  // await writeFile(
  //   path.join(__dirname, "fixtures/output/cover.jpg"),
  //   file.value
  // );
  const output = await readFile(
    path.join(__dirname, "fixtures/output/cover.jpg")
  );
  test.equal(file.value.length, output.length);
  test.equal(file, await epub.cover());
});

tap.test("Epub  processTextFile css", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  const file = await epub.file("style.css");
  // await writeFile(path.join(__dirname, "fixtures/output/test.css"), file.value);
  test.equal(
    file.value,
    await readFile(path.join(__dirname, "fixtures/output/test.css"), {
      encoding: "utf8",
    })
  );
});

tap.test("Epub markup", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  const file = await epub.markup("test.xhtml");
  test.ok(file);
  // console.log(file);
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

// tap.test("Epub uploads", async (test) => {
//   const epub = await setupFile();
//   function worker(promise) {
//     return promise;
//   }
//   const tasks = epub.upload({ worker });
//   test.equal(tasks.length, 7);
//   const results = await Promise.all(tasks.map((task) => task()));
//   const paths = results.map((result) => result && result.path);
//   test.notOk(paths.filter((path) => path).find((path) => path.endsWith("js")));
// });

tap.test("Epub process", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file(EPUB);
  const result = await epub.view();
  // await writeFile(
  //   path.join(
  //     __dirname,
  //     "fixtures/output/",
  //     path.basename(result.url) + ".json"
  //   ),
  //   JSON.stringify(result, null, 2)
  // );
  const resource = JSON.parse(
    await readFile(
      path.join(
        __dirname,
        "fixtures/output/",
        path.basename(result.url) + ".json"
      ),
      {
        encoding: "utf8",
      }
    )
  );
  test.same(result, resource);
});

// tap.test("Epub render", async (test) => {
//   let counter = 0;

//   function id() {
//     counter = counter + 1;
//     return counter + "_id";
//   }

//   const names = new Names(id);
//   const testEnv = { ...env, names };
//   const factory = new EpubFactory(testEnv);
//   const epub = await factory.file(EPUB);
//   async function worker(upload) {
//     return upload;
//   }
//   const result = await epub.render(
//     {
//       url: {
//         base: "http://test.example.com/",
//         upload: "http://upload.example.com/",
//       },
//       worker,
//     },
//     { stylesheets: ["style.css"] }
//   );
//   // await writeFile(
//   //   path.join(__dirname, "fixtures/output/", "index.html"),
//   //   result
//   // );
//   test.same(
//     result,
//     await readFile(path.join(__dirname, "fixtures/output/", "index.html"), {
//       encoding: "utf8",
//     })
//   );
// });
// tap.test("Epub render 2", async (test) => {
//   let counter = 0;

//   function id() {
//     counter = counter + 1;
//     return counter + "_id";
//   }

//   const names = new Names(id);
//   const testEnv = { ...env, names };
//   const factory = new EpubFactory(testEnv);
//   const epub = await factory.file(EPUB);
//   async function worker(upload) {
//     return upload;
//   }
//   const result = await epub.render(
//     {
//       url: {
//         base: "http://test.example.com/",
//         upload: "http://upload.example.com/",
//       },
//       worker,
//     },
//     {
//       description: "Test Epub file",
//       cover: "/cover.jpeg",
//       scriptHTML: "<script src='/script.js' module></script>",
//       canonical: "https://canonical.example.com/",
//       faviconMain: "https://www.example.com/favicon",
//       faviconSVG: "https://www.example.com/favicon",
//       manifestURL: "https://www.example.com/manifest",
//       appleIcon: "https://www.example.com/appleIcon",
//     }
//   );
//   // await writeFile(
//   //   path.join(__dirname, "fixtures/output/", "index2.html"),
//   //   result
//   // );
//   test.same(
//     result,
//     await readFile(path.join(__dirname, "fixtures/output/", "index2.html"), {
//       encoding: "utf8",
//     })
//   );
// });

// async function setupFile() {
//   let counter = 0;

//   function id() {
//     counter = counter + 1;
//     return counter + "_id";
//   }

//   const names = new Names(id);
//   const testEnv = { ...env, names };
//   const factory = new EpubFactory(testEnv);
//   const epub = await factory.file(EPUB);
//   epub.base = new Base(
//     {
//       base: "http://test.example.com/",
//       upload: "http://upload.example.com/",
//     },
//     { names }
//   );
//   await epub.task("getMetadata");
//   return epub;
// }
