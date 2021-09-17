import { getId } from "./id.js";
import { filterResources } from "./parsers/js-types.js";
import { ResourceDescriptor, asResource, Resource } from "./resource.js";
import { Person, asPerson } from "./person.js";
import { asArray } from "./utils/asArray.js";
import { settings } from "./env.js";
import { asValue } from "./utils/asValue.js";
import { isString } from "./utils/isString.js";

export interface Metadata {
  resources: ResourceDescriptor[];
  "@context"?: ["https://schema.org", "https://www.w3.org/ns/wp-context"];
  type?: string[];
  name?:
    | string
    | { value: string; language: string; direction?: string }
    | Array<{ value: string; language: string; direction?: string }>;
  inLanguage?: string;
  links?: ResourceDescriptor[];
  readingOrder?: ResourceDescriptor[];
  id?: string;
  _epubVersion?: string;
  creator?: string[];
  author?: string[];
  translator?: string[];
  colorist?: string[];
  publisher?: string[];
  illustrator?: string[];
  contributor?: string[];
  editor?: string[];
  dateModified?: string;
  datePublished?: string;
}

export const resourceProperties = ["readingOrder", "resources", "links"];
const personProperties = [
  "creator",
  "author",
  "translator",
  "author",
  "colorist",
  "publisher",
  "illustrator",
  "contributor",
  "editor",
];
const chapterFormats = ["application/xhtml+xml", "text/html", "image/svg+xml"];

export class Publication {
  resources: Resource[];
  readingOrder: Resource[];
  links?: Resource[];
  id?: string;
  type?: string[];
  name:
    | { value: string; language: string; direction?: string }
    | Array<{ value: string; language: string; direction?: string }>;
  inLanguage: string;
  #language: string;
  creator?: Person[];
  author?: Person[];
  translator?: Person[];
  colorist?: Person[];
  publisher?: Person[];
  illustrator?: Person[];
  contributor?: Person[];
  editor?: Person[];
  _epubVersion?: string;
  dateModified?: Date;
  datePublished?: Date;
  #meta?: { [s: string]: any };
  #resourceMap = new Map();

  constructor(descriptor) {
    const {
      inLanguage = settings.get("inLanguage"),
      language = settings.get("language"),
    } = descriptor;
    this.#meta = { ...descriptor };
    this.id = descriptor.id;
    this.type = asArray(descriptor.type);
    this.inLanguage = inLanguage;
    this.#language = language;
    this._epubVersion = descriptor._epubVersion;
    if (descriptor.dateModified) {
      this.dateModified = new Date(descriptor.dateModified);
    }
    if (descriptor.datePublished) {
      this.datePublished = new Date(descriptor.datePublished);
    }
    for (const property of resourceProperties) {
      this[property] = asArray(descriptor[property]).map(
        (resource: unknown) => {
          const result = asResource(resource);
          if (property !== "links") {
            this.#resourceMap.set(result.url, result);
          }
          return result;
        }
      );
    }
    for (const property of personProperties) {
      this[property] = asArray(descriptor[property]).map((person: unknown) => {
        return asPerson(person, language);
      });
    }
    if (isString(descriptor.name)) {
      this.name = { value: descriptor.name, language };
    } else if (
      descriptor.name &&
      isString(descriptor.name.value) &&
      isString(descriptor.name.language)
    ) {
      this.name = descriptor.name;
    }
  }

  get(property) {
    return asArray(this.#meta[property]).map((value) => asValue(value));
  }

  getValue(property) {
    return this.get(property)[0].value;
  }

  resource(path) {
    return this.#resourceMap.get(path);
  }

  relation(rel) {
    const resources = Array.from(this.#resourceMap.values());
    return resources.filter((resource) => asArray(resource.rel).includes(rel));
  }

  chapters() {
    const resources = Array.from(this.#resourceMap.values());
    return resources.filter((resource) =>
      chapterFormats.includes(resource.encodingFormat)
    );
  }

  images() {
    const resources = Array.from(this.#resourceMap.values());
    return resources.filter((resource) =>
      resource.encodingFormat.includes("image")
    );
  }
  image() {
    return this.images()[0];
  }

  cover() {
    const covers = this.relation("cover");
    return covers.find((resource) => resource.encodingFormat.includes("image"));
  }

  toJSON() {
    const json = { ...this.#meta, ...this };
    delete json._epubVersion;
    // delete json._meta;
    return json;
  }

  embed() {
    const resources = filterResources(this.resources)
      .map((resource) => {
        if (!chapterFormats.includes(resource.encodingFormat)) {
          return resource;
        }
      })
      .filter((resource) => resource);
    const links = filterResources(this.links).map((resource) => {
      const full = new URL(resource.url, "https://example.com/");
      if (full.hostname === "example.com") {
        const url = "#" + getId(resource.url);
        return new Resource({ ...resource, url });
      } else {
        return new Resource(resource);
      }
    });
    const json = this.toJSON();
    return { ...json, resources, links, readingOrder: undefined };
  }
}
export function asPublication(publication): Publication {
  if (
    publication.resources &&
    Array.isArray(publication.resources) &&
    publication.readingOrder &&
    Array.isArray(publication.readingOrder)
  ) {
    return new Publication(publication);
  } else {
    throw new Error("Invalid metadata for publication");
  }
}
