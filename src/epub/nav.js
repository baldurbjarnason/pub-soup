import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

const options = {
  withDomLvl1: true,
  normalizeWhitespace: false,
  xmlMode: true,
  decodeEntities: true,
};

export function toc(text, url) {
  const $ = cheerio.load(text, options);
  if ($("html").length !== 0) {
    return parseNavHTML($, url);
  } else {
    return parseNCX($, url);
  }
}

function parseNavHTML($, url) {
  const toc = {
    type: "html",
    url,
    children: [],
  };
  if ($("html").attr("xml:lang")) {
    toc.inLanguage = $("html").attr("xml:lang");
  } else if ($("html").attr("lang")) {
    toc.inLanguage = $("html").attr("lang");
  } else {
    toc.inLanguage = $('nav[epub\\:type="toc"]').attr("xml:lang");
  }
  const heading = $('nav[epub\\:type="toc"] > :first-child');
  const list = $('nav[epub\\:type="toc"] > ol');
  if (heading.get(0) !== list.get(0)) {
    toc.heading = heading.text();
  }
  $("a").each((i, element) => {
    const node = $(element);
    node.attr("href", getPath(node.attr("href"), url));
  });
  $('nav[epub\\:type="toc"] > ol > li').each((i, element) =>
    parseListItem(i, element, toc, $)
  );

  function parseListItem(i, element, item, $) {
    const el = $(element);
    const child = {
      children: [],
    };
    if (el.find("> a").length !== 0) {
      child.label = el.find("> a").text().trim();
      child.url = el.find("> a").attr("href");
    } else {
      child.label = el.find("> span").text().trim();
    }
    const children = el.find("> ol > li");
    children.each((i, element) => parseListItem(i, element, child, $));
    item.children = item.children.concat(child);
  }
  return toc;
}

function parseNCX($, url) {
  const toc = {
    type: "NCX",
    url,
    children: [],
  };
  toc.heading = $("docTitle > text").text();
  // if undefined, fall back on publication language when rendering.
  toc.inLanguage = $("ncx").attr("xml:lang");
  $("navMap > navPoint").each((i, element) =>
    parseNavPoint(i, element, toc, $)
  );
  function parseNavPoint(i, element, item, $) {
    const point = $(element);
    const label = point.find("> navLabel").text().trim();
    const url = getPath(point.find("content").attr("src"), toc.url);
    const child = {
      label,
      url,
      children: [],
    };
    const children = point.find("> navPoint");
    children.each((i, element) => parseNavPoint(i, element, child, $));
    item.children = item.children.concat(child);
  }
  return toc;
}

function getPath(path, opfPath) {
  const opf = new URL(opfPath, "https://example.com/");
  // If host is example.com, then this is a local request
  const url = new URL(path, opf);
  return url.pathname.replace("/", "") + url.hash;
}
