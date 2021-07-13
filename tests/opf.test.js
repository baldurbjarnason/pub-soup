import { opf as parseOPF } from "../src/epub/opf.js";
import tap from "tap";
import { fileURLToPath } from "url";
import * as fs from "fs";
import * as path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace(process.cwd() + "/", "");

tap.test("parseOPF - epub2", async (test) => {
  const bookMeta = fs.readFileSync(
    path.join(
      __dirname,
      "./fixtures/demo-epub/pg55456-images/OEBPS/content.opf"
    ),
    "utf8"
  );
  const result = await parseOPF(
    bookMeta,
    "demo-epub/pg55456-images/OEBPS/content.opf"
  );
  test.matchSnapshot(result, "parseOPF - epub2");
});
tap.test("parseOPF - epub3", async (test) => {
  const bookMeta = fs.readFileSync(
    path.join(
      __dirname,
      "./fixtures/demo-epub/childrens-literature/EPUB/package.opf"
    ),
    "utf8"
  );
  const result = await parseOPF(
    bookMeta,
    "demo-epub/childrens-literature/EPUB/package.opf"
  );
  test.matchSnapshot(result, "parseOPF - epub3");
});
