import { getId } from "./id.js";
import { filterResources } from "./parsers/js-types.js";
import { ResourceDescriptor, asResource, Resource } from "./resource.js";
import { Person, asPerson } from "./person.js";

export interface Metadata {
  resources: ResourceDescriptor[];
  "@context"?: ["https://schema.org", "https://www.w3.org/ns/wp-context"];
  type?: string[];
  name?: string | { value: string; language: string };
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

export const resourceProperties = ["resources", "readingOrder", "links"];
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

export class Publication {
  resources: Resource[];
  readingOrder: Resource[];
  links?: Resource[];
  id?: string;
  type?: string[];
  name: { value: string; language: string };
  inLanguage: string;
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
  _meta?: { [s: string]: any };

  constructor(descriptor) {
    const { inLanguage = "en" } = descriptor;
    this._meta = { ...descriptor };
    this.id = descriptor.id;
    this.type = asArray(descriptor.type);
    this.inLanguage = inLanguage;
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
          return asResource(resource, this.inLanguage);
        }
      );
    }
    for (const property of personProperties) {
      this[property] = asArray(descriptor[property]).map((person: unknown) => {
        return asPerson(person, this.inLanguage);
      });
    }
    if (isString(descriptor.name)) {
      this.name = { value: descriptor.name, language: inLanguage };
    } else if (
      descriptor.name &&
      isString(descriptor.name.value) &&
      isString(descriptor.name.language)
    ) {
      this.name = descriptor.name;
    }
  }

  get(property) {
    return this._meta[property];
  }

  toJSON() {
    const json = { ...this._meta, ...this };
    delete json._epubVersion;
    delete json._meta;
    return json;
  }
  embed() {
    const chapterFormats = [
      "application/xhtml+xml",
      "text/html",
      "image/svg+xml",
    ];
    const resources = filterResources(this.resources).map((resource) => {
      if (chapterFormats.includes(resource.encodingFormat)) {
        const url = "#" + getId(resource.url);
        return new Resource({ ...resource, url });
      } else {
        return resource;
      }
    });
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

function isString(x) {
  return typeof x === "string";
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

// export function embed(archive) {
//   const resources = archive._metadata.resources.map((resource) => {
//     resource = Object.assign({}, resource);
//     resource.url = "#" + getId(resource.url);
//     return resource;
//   });
//   const readingOrder = archive._metadata.readingOrder.map((resource) => {
//     resource = Object.assign({}, resource);
//     resource.url = "#" + getId(resource.url);
//     return resource;
//   });
//   return {
//     ...archive._metadata,
//     url: "index.html",
//     resources: filterResources(resources),
//     readingOrder: filterResources(readingOrder),
//   };
// }

export function asArray(x: unknown): any[] {
  if (Array.isArray(x)) {
    return x;
  } else if (!x) {
    return [];
  } else if (typeof x === "string") {
    return [x];
  }
}
