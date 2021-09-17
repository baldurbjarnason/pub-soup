import { Publication, asPublication } from "../dist/lib/metadata.js";
import tap from "tap";

tap.formatSnapshot = (obj) => JSON.stringify(obj, null, 2);

tap.test("metadata embed", async (test) => {
  const _metadata = {
    type: ["Book"],
    resources: [{ url: "file.html" }, { url: "image.jpeg" }],
    readingOrder: [{ url: "file.html" }],
    links: [
      { url: "https://www.example.com/important-external" },
      { url: "important/external" },
    ],
  };
  const publication = new Publication(_metadata);
  const result = publication.embed();
  // Should not include fragment identified resources in resources.
  test.equal(result.resources[0].url, "image.jpeg");
  // Should not include readingOrder if you're embedding in a single HTML file.
  test.notOk(result.readingOrder);
  test.equal(result.links[0].url, "https://www.example.com/important-external");
  test.equal(result.links[1].url, "#idaW1wb3J0YW50L2V4dGVybmFs");
});

tap.test("metadata name", async (test) => {
  const _metadata = {
    type: ["Book"],
    name: { value: "Fake Book", language: "en" },
    resources: [{ url: "file.html" }],
    readingOrder: [{ url: "file.html" }],
    links: [
      { url: "https://www.example.com/important-external" },
      { url: "important/external" },
    ],
  };
  const publication = new Publication(_metadata);
  test.equal(publication.name.value, "Fake Book");
});

tap.test("metadata get", async (test) => {
  const _metadata = {
    type: ["Book"],
    numberOfPages: 251,
    name: { value: "Fake Book", language: "en" },
    resources: [{ url: "file.html" }],
    readingOrder: [{ url: "file.html" }],
    links: [
      { url: "https://www.example.com/important-external" },
      { url: "important/external" },
    ],
  };
  const publication = new Publication(_metadata);
  test.equal(publication.getValue("numberOfPages"), 251);
});

tap.test("Invalid Publication", async (test) => {
  const metadata = {
    type: ["Book"],
    links: [
      { url: "https://www.example.com/important-external" },
      { url: "important/external" },
    ],
  };
  test.throws(() => {
    return asPublication(metadata);
  });
});

const testManifest1 = {
  "@context": ["https://schema.org", "https://www.w3.org/ns/wp-context"],
  type: "Book",
  url: "https://publisher.example.org/mobydick",
  author: "Herman Melville",
  dateModified: "2018-02-10T17:00:00Z",

  readingOrder: [
    "html/title.html",
    "html/copyright.html",
    "html/introduction.html",
    "html/epigraph.html",
    "html/c001.html",
    "html/c002.html",
    "html/c003.html",
    "html/c004.html",
    "html/c005.html",
    "html/c006.html",
  ],

  resources: [
    "css/mobydick.css",
    {
      type: "LinkedResource",
      rel: "cover",
      url: "images/cover.jpg",
      encodingFormat: "image/jpeg",
    },
    {
      type: "LinkedResource",
      url: "html/toc.html",
      rel: "contents",
    },
    {
      type: "LinkedResource",
      url: "fonts/Literata.otf",
      encodingFormat: "application/vnd.ms-opentype",
    },
    {
      type: "LinkedResource",
      url: "fonts/Literata-Bold.otf",
      encodingFormat: "application/vnd.ms-opentype",
    },
    {
      type: "LinkedResource",
      url: "fonts/Literata-BoldItalic.otf",
      encodingFormat: "application/vnd.ms-opentype",
    },
    {
      type: "LinkedResource",
      url: "fonts/Literata-Italic.otf",
      encodingFormat: "application/vnd.ms-opentype",
    },
  ],
};

tap.test("Publication parse", async (test) => {
  const publication = asPublication(testManifest1);
  test.matchSnapshot(publication, "Publication parse testManifest1");
});
