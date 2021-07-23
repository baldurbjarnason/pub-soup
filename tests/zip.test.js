import { Epub, EpubFactory } from "../src/epub/index.js";
// import { ZipFactory } from "../src/zip/index.js";
import { Formats, formats } from "../index.js";
import { env } from "../src/env.js";
import tap from "tap";
import * as td from "testdouble";
import { readFile } from "fs/promises";
import { join } from "path";
import handler from "serve-handler";
import * as http from "http";

tap.afterEach(() => {
  td.reset();
});

tap.test("Epub factory file", async (test) => {
  const file = new Epub({}, env);
  test.ok(file);
  const factory = new EpubFactory(env);
  test.type(factory.Archive, Epub);
  const epub = await formats.file("application/epub+zip", "test.epub");
  test.ok(epub);
});

tap.test("Zip factory url", async (test, done) => {
  const server = http.createServer((request, response) => {
    return handler(request, response);
  });
  server.listen(3000, () => {});
  const epub = await formats.url(
    "application/epub+zip",
    "http://localhost:3000/test.epub"
  );
  test.ok(epub);
  const file = await epub.textFile("mimetype");
  test.equal(file, "application/epub+zip");
  server.close(done);
});

tap.test("Zip factory buffer", async (test) => {
  const buffer = await readFile(join(process.cwd(), "test.epub"));
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
  const zip = await formats.file("application/zip", "test.epub");
  const file = await zip.textFile("mimetype");
  test.equal(file, "application/epub+zip");
});

tap.test("Zip dataFile", async (test) => {
  const epub = await formats.file("application/epub+zip", "test.epub");
  const file = await epub.dataFile("mimetype");
  test.equal(file.toString(), "application/epub+zip");
});
