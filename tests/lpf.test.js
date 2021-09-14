import { Lpf } from "../dist/lib/lpf/index.js";
import { formats } from "../dist/index.js";
import tap from "tap";
import { readFile } from "fs/promises";

const LPF = "tests/fixtures/test.lpf";

tap.test("Lpf file", async (test) => {
  const lpf = await formats.file("application/lpf+zip", LPF);
  test.ok(lpf instanceof Lpf);
  const publication = await lpf.resource("publication.json");
  test.equal(publication.url, "publication.json");
  test.notOk(await lpf.file("index.html"));
  const file = await lpf.file("cover.jpg");
  const cover = await readFile("tests/fixtures/demo-lpf/cover.jpg");
  test.same(file.value, cover);
});

tap.test("Lpf file - linked metadata", async (test) => {
  const lpf = await formats.file(
    "application/lpf+zip",
    "tests/fixtures/metadata.lpf"
  );
  const file = await lpf.file("cover.jpg");
  const cover = await readFile("tests/fixtures/demo-lpf/cover.jpg");
  test.same(file.value, cover);
});

tap.test("Lpf file - opf disabled", async (test) => {
  const lpf = await formats.file("application/lpf+zip", LPF);
  test.notOk(lpf.opf());
});

tap.test("Lpf file - invalid resource", async (test) => {
  const lpf = await formats.file(
    "application/lpf+zip",
    "tests/fixtures/invalid-resource.lpf"
  );
  const publication = await lpf.metadata();
  test.equal(publication.resources.length, 1);
});

tap.test("Lpf file - invalid", async (test) => {
  const lpf = await formats.file(
    "application/lpf+zip",
    "tests/fixtures/invalid.lpf"
  );
  test.rejects(async () => {
    const publication = await lpf.metadata();
    return publication;
  });
});

tap.test("Lpf file - unlinked metadata", async (test) => {
  const lpf = await formats.file(
    "application/lpf+zip",
    "tests/fixtures/unlinked.lpf"
  );
  const publication = await lpf.metadata();
  test.notOk(publication.name);
  test.equal(publication, await lpf.metadata());
});

tap.test("Lpf file - embedded metadata", async (test) => {
  const lpf = await formats.file(
    "application/lpf+zip",
    "tests/fixtures/embedded.lpf"
  );
  const publication = await lpf.metadata();
  test.equal(publication.get("name")[0], "ePub Experiment 1");
  test.ok(await lpf.file("index.html"));
});

tap.test("Lpf file - embedded metadata - localised title", async (test) => {
  const lpf = await formats.file(
    "application/lpf+zip",
    "tests/fixtures/icelandic-title.lpf"
  );
  const publication = await lpf.metadata();
  test.equal(publication.get("name")[0].value, "Þetta Er Tilraun");
  test.equal(publication.get("name")[0].language, "is");
});
