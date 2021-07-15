import cheerio from "cheerio";

// This should be rewritten to use a proper xml parser.

const options = {
  withDomLvl1: true,
  normalizeWhitespace: false,
  xmlMode: true,
  decodeEntities: true,
};

export function opf(text, opfPath) {
  const $ = cheerio.load(text, options);
  const book = {
    "@context": ["https://schema.org", "https://www.w3.org/ns/wp-context"],
    type: ["Book"],
    links: [],
    resources: [],
    readingOrder: [],
  };
  book.inLanguage = $("dc\\:language").text();
  const titles = [];
  $("dc\\:title").each((index, el) => {
    titles[index] = $(el).text();
  });
  book.name = titles.join("\n");

  const packageElement = $("package");
  const idforid = packageElement.attr("unique-identifier");
  book.id = $(`#${idforid}`).text();
  book._epubVersion = packageElement.attr("version");
  const ncxId = $("spine").attr("toc");
  const coverId = $('[name="cover"]').attr("content");
  book.resources = $("manifest > item")
    .map((index, item) => {
      const node = $(item);
      const properties = node.attr("properties");
      const rel = [];
      if (properties && properties.indexOf("nav") !== -1) {
        rel.push("contents");
      }
      const id = node.attr("id");
      if (id === ncxId) {
        rel.push("ncx");
      }
      if (properties && properties.indexOf("cover-image") !== -1) {
        rel.push("cover");
      } else if (id === coverId) {
        rel.push("cover");
      }

      return {
        url: getPath(node.attr("href"), opfPath),
        rel,
        id,
        encodingFormat: node.attr("media-type"),
      };
    })
    .toArray();
  book.readingOrder = $('itemref:not([linear="no"])')
    .map((index, ref) => {
      const node = $(ref);
      return book.resources.find((item) => {
        return item.id === node.attr("idref");
      });
    })
    .toArray();
  book.resources = book.resources.map((item) => {
    delete item.id;
    return item;
  });
  book.resources = book.resources.concat({
    type: "LinkedResource",
    rel: ["alternate", "describedby"],
    url: opfPath,
    encodingFormat: "application/oebps-package+xml",
  });
  book.creator = $("dc\\:creator")
    .map((index, author) => {
      return $(author).text();
    })
    .toArray();

  book.publisher = $("dc\\:publisher")
    .map((index, publisher) => {
      return $(publisher).text();
    })
    .toArray();
  const knownRoles = ["trl", "ill", "edt", "clr", "aut"];
  const creators = $("dc\\:creator")
    .map((index, contributor) => {
      const node = $(contributor);
      return {
        name: node.text(),
        id: node.attr("id"),
        role: node.attr("opf:role"),
      };
    })
    .toArray();
  const contributors = $("dc\\:contributor")
    .map((index, contributor) => {
      const node = $(contributor);
      return {
        name: node.text(),
        id: node.attr("id"),
        role: node.attr("opf:role"),
      };
    })
    .toArray();
  if (book._epubVersion !== "2.0") {
    $('meta[property="role"]').each((index, role) => {
      const node = $(role);
      const id = node.attr("refines");
      const refined =
        creators.find((item) => item.id === id.replace("#", "")) ||
        contributors.find((item) => item.id === id.replace("#", ""));
      refined.role = node.text();
    });
    if ($('meta[property="dcterms\\:modified"]').text()) {
      book.dateModified = $('meta[property="dcterms\\:modified"]').text();
    }
    if ($("metadata dc\\:date").text()) {
      book.datePublished = $("metadata dc\\:date").text();
    }
  } else if (book._epubVersion === "2.0") {
    if ($(`metadata dc\\:date[opf\\:event="publication"]`).text()) {
      book.datePublished = $(
        `metadata dc\\:date[opf\\:event="publication"]`
      ).text();
    }
    if ($(`metadata dc\\:date[opf\\:event="modification"]`).text()) {
      book.dateModified = $(
        `metadata dc\\:date[opf\\:event="publication"]`
      ).text();
    }
  }
  book.author = creators
    .filter((creator) => creator.role === "aut")
    .map((creator) => creator.name);
  book.creator = creators
    .filter((creator) => !knownRoles.includes(creator.role))
    .map((creator) => creator.name);

  book.translator = [].concat(
    contributors
      .filter((contributor) => contributor.role === "trl")
      .map((contributor) => contributor.name),
    creators
      .filter((contributor) => contributor.role === "trl")
      .map((contributor) => contributor.name)
  );
  book.illustrator = [].concat(
    contributors
      .filter((contributor) => contributor.role === "ill")
      .map((contributor) => contributor.name),
    creators
      .filter((contributor) => contributor.role === "ill")
      .map((contributor) => contributor.name)
  );
  book.editor = [].concat(
    contributors
      .filter((contributor) => contributor.role === "edt")
      .map((contributor) => contributor.name),
    creators
      .filter((contributor) => contributor.role === "edt")
      .map((contributor) => contributor.name)
  );
  book.colorist = [].concat(
    contributors
      .filter((contributor) => contributor.role === "clr")
      .map((contributor) => contributor.name),
    creators
      .filter((contributor) => contributor.role === "clr")
      .map((contributor) => contributor.name)
  );
  book.contributor = [].concat(
    contributors
      .filter((contributor) => !knownRoles.includes(contributor.role))
      .map((creator) => creator.name),
    creators
      .filter((contributor) => !knownRoles.includes(contributor.role))
      .map((creator) => creator.name)
  );
  return book;
}

function getPath(path, opfPath) {
  const opf = new URL(opfPath, "http://example.com/");
  return new URL(decodeURIComponent(path), opf).pathname.replace("/", "");
}
