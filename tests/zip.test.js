import { Epub, EpubFactory } from "../src/epub/index.js";
import { ZipFactory } from "../src/zip/index.js";
import { env } from "../src/env.js";
import tap from "tap";
import * as td from "testdouble";
// import { fileURLToPath } from "url";
// import * as fs from "fs";
// import * as path from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename).replace(process.cwd() + "/", "");

tap.afterEach(() => {
  td.reset();
});

tap.test("Epub factory file", async (test) => {
  const file = new Epub({}, env);
  test.ok(file);
  const factory = new EpubFactory(env);
  test.type(factory.Archive, Epub);
  const epub = await factory.file("test.epub");
  test.ok(epub);
});

tap.test("Zip factory url", async (test) => {
  const unzip = td.object(env.unzip);
  const testEnv = { ...env, unzip };
  const factory = new ZipFactory(testEnv);
  const epub = await factory.url("test.epub");
  test.ok(epub);
  td.verify(unzip.url("test.epub"));
});

tap.test("Zip factory buffer", async (test) => {
  const unzip = td.object(env.unzip);
  const testEnv = { ...env, unzip };
  const factory = new ZipFactory(testEnv);
  const buffer = Buffer.from("test.epub");
  const epub = await factory.buffer(buffer);
  test.ok(epub);
  td.verify(unzip.buffer(buffer));
});

tap.test("Zip factory s3", async (test) => {
  const unzip = td.object(env.unzip);
  const testEnv = { ...env, unzip };
  const factory = new ZipFactory(testEnv);
  const s3Client = () => {};
  const config = {};
  const epub = await factory.s3(s3Client, config);
  test.ok(epub);
  td.verify(unzip.s3(s3Client, config));
});

tap.test("Zip textFile", async (test) => {
  const factory = new ZipFactory(env);
  const zip = await factory.file("test.epub");
  const file = await zip.textFile("mimetype");
  test.equal(file, "application/epub+zip");
});

tap.test("Zip dataFile", async (test) => {
  const factory = new EpubFactory(env);
  const epub = await factory.file("test.epub");
  const file = await epub.dataFile("mimetype");
  test.equal(file.toString(), "application/epub+zip");
});
