import { Epub, EpubFactory } from "../dist/lib/epub/index.js";
// import { ZipFactory } from "../src/zip/index.js";
import { Formats, formats } from "../dist/index.js";
import { env } from "../dist/lib/env.js";
import tap from "tap";
import * as td from "testdouble";
import { readFile } from "fs/promises";
import { join } from "path";
import handler from "serve-handler";
import * as http from "http";

tap.afterEach(() => {
  td.reset();
});

const EPUB = "tests/fixtures/test.epub";

tap.test("Epub factory file", async (test) => {
  const file = new Epub({}, env);
  test.ok(file);
  const factory = new EpubFactory(env);
  test.type(factory.Archive, Epub);
  const epub = await formats.file("application/epub+zip", EPUB);
  test.ok(epub);
});

function stream2buffer(stream) {
  return new Promise((resolve, reject) => {
    const _buf = [];

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
}

tap.test("Zip file - stream", async (test) => {
  const expectedBuffer = Buffer.from("application/epub+zip");
  const epub = await formats.file("application/zip", EPUB);
  const bytes = await stream2buffer(
    epub.streamForResource({ url: "mimetype" })
  );
  test.same(bytes, expectedBuffer);

  test.ok(epub);
});

tap.test("Zip file - file nonexistent", async (test) => {
  const epub = await formats.file("application/zip", EPUB);
  const result = await epub.file("kowabunga.dude");
  test.notOk(result);
});
tap.test("Zip file - stream nonexistent", async (test) => {
  const epub = await formats.file("application/zip", EPUB);
  test.notOk(epub.streamForResource({ url: "kowabunga.dude" }));
});

tap.test("Zip factory url", async (test, done) => {
  const server = http.createServer((request, response) => {
    return handler(request, response);
  });
  server.listen(3000, () => {});
  const epub = await formats.url(
    "application/epub+zip",
    "http://localhost:3000/tests/fixtures/test.epub"
  );
  test.ok(epub);
  const file = await epub.textFile("mimetype");
  test.equal(file, "application/epub+zip");
  server.close(done);
});

tap.test("Zip factory buffer", async (test) => {
  const buffer = await readFile(join(process.cwd(), EPUB));
  const epub = await formats.buffer("application/zip", buffer);
  test.ok(epub);
});

tap.test("Zip factory s3", async (test) => {
  const testEnv = td.object(env);
  const formats = new Formats(testEnv);
  const s3Client = () => {};
  const config = {};
  const epub = await formats.s3("application/zip", s3Client, config);
  test.ok(epub);
  td.verify(testEnv.s3(s3Client, config));
});

tap.test("Zip textFile", async (test) => {
  const zip = await formats.file("application/zip", EPUB);
  const file = await zip.textFile("mimetype");
  test.equal(file, "application/epub+zip");
});

tap.test("Zip dataFile", async (test) => {
  const epub = await formats.file("application/epub+zip", EPUB);
  const file = await epub.dataFile("mimetype");
  test.equal(file.toString(), "application/epub+zip");
});

tap.test("Zip file", async (test) => {
  const zip = await formats.file("application/zip", EPUB);
  const file = await zip.file("META-INF/container.xml");
  test.equal(
    file.value,
    `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
   <rootfiles>
      <rootfile full-path="content.opf"
      media-type="application/oebps-package+xml"/>
   </rootfiles>
</container>`
  );
});

tap.test("Zip buffer file", async (test) => {
  const epub = await formats.file("application/zip", EPUB);
  const file = await epub.file("mimetype");
  test.equal(file.value.toString(), "application/epub+zip");
});

tap.test("Zip resource should check if file exists", async (test) => {
  const epub = await formats.file("application/zip", EPUB);
  const file = await epub.file("bling-blong.booble");
  test.notOk(file);
});
tap.test("Zip file - generated metadata", async (test) => {
  const zip = await formats.file(
    "application/zip",
    "tests/fixtures/embedded.lpf"
  );
  const publication = await zip.metadata();
  test.equal(publication.readingOrder[0].url, "index.html");
});

tap.test("Zip file - generated metadata for cover", async (test) => {
  const zip = await formats.file(
    "application/zip",
    "tests/fixtures/embedded.lpf"
  );
  const cover = await zip.cover();
  test.equal(cover.url, "cover.jpg");
});

tap.test("Zip file - first image in zip", async (test) => {
  const zip = await formats.file(
    "application/zip",
    "tests/fixtures/embedded.lpf"
  );
  const image = await zip.image();
  test.equal(image.url, "cover.jpg");
});

tap.test("Zip file - generated metadata - images", async (test) => {
  const zip = await formats.file(
    "application/zip",
    "tests/fixtures/images.zip"
  );
  const publication = await zip.metadata();
  test.equal(publication.readingOrder[0].url, "page1.jpg");
});
