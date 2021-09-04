import { getId } from "./id.js";
import { filterResources } from "./parsers/js-types.js";
import { ResourceDescriptor } from "./resource.js";

export interface Metadata {
  resources: ResourceDescriptor[];
  "@context"?: ["https://schema.org", "https://www.w3.org/ns/wp-context"];
  type?: string[];
  name?: string;
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

export function embed(archive) {
  const resources = archive._metadata.resources.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = "#" + getId(resource.url);
    return resource;
  });
  const readingOrder = archive._metadata.readingOrder.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = "#" + getId(resource.url);
    return resource;
  });
  return {
    ...archive._metadata,
    url: "index.html",
    resources: filterResources(resources),
    readingOrder: filterResources(readingOrder),
  };
}
