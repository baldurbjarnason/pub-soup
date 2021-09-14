import cheerio from "cheerio";
import { path } from "../base.js";
import { getId } from "../id.js";
import {
  Metadata,
  Publication,
  asPublication,
  asArray,
  resourceProperties,
} from "../metadata.js";
import { Resource, asResource } from "../resource.js";

const options = {
  withDomLvl1: true,
  normalizeWhitespace: false,
  decodeEntities: true,
};
export async function extractMeta(lpf, file): Promise<Publication> {
  const $ = cheerio.load(file, options);
  const linkElement = $('link[rel*="publication"]');
  // if (!linkElement) return null;
  const link = linkElement.attr("href");
  let meta, lang, dir, title;
  let base = "index.html";
  if (link && link[0] === "#") {
    const script = $(link);
    if (script.attr("type") === "application/ld+json") {
      meta = script.text();
      lang = script.attr("lang");
      dir = script.attr("dir");
      const titleElement = $("title");
      if (titleElement.attr("lang")) {
        title = [
          { value: titleElement.text(), language: titleElement.attr("lang") },
        ];
      } else {
        title = [titleElement.text()];
      }
    }
  } else if (
    link &&
    new URL(link, "https://example.com").hostname === "example.com"
  ) {
    base = link;
    meta = await lpf.textFile(link);
  } else {
    meta = null;
  }
  let metadata;
  try {
    metadata = JSON.parse(meta);
  } catch (error) {
    metadata = {};
  }
  return normalise(metadata, { lang, dir, title, base });
}

export function normalise(
  metadata,
  {
    lang,
    dir,
    title,
    base,
  }: { lang?: string; dir?: string; title?: string; base: string }
) {
  metadata = { ...metadata };
  if (!metadata.name) {
    metadata.name = title;
  }
  if (!metadata.inLanguage) {
    metadata.inLanguage = lang;
  }
  if (!metadata.inDirection) {
    metadata.inDirection = dir;
  }

  for (const property of resourceProperties) {
    metadata[property] = asArray(metadata[property])
      .map((resource: any) => {
        if (typeof resource === "string") {
          resource = path(resource, base);
        } else if (!resource.url) {
          return null;
        } else {
          resource.url = path(resource.url, base);
          resource.id = getId(resource.url);
        }
        return resource;
      })
      .filter((resource) => resource);
  }
  const publication = asPublication(metadata);
  return publication;
}
