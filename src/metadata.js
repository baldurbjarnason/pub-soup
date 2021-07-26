import { filterResources } from "./parsers/js-types.js";

export function toJSON(archive) {
  const meta = archive._metadata;
  const resources = meta.resources.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.upload(archive.names.get(resource.url));
    return resource;
  });
  const readingOrder = meta.readingOrder.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.upload(archive.names.get(resource.url));
    return resource;
  });
  return { ...meta, resources, readingOrder };
}
export function embed(archive) {
  const url = archive.names.get("index.html");
  const resources = archive._metadata.resources.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.transform(resource.url, "index.html", "link");
    return resource;
  });
  const readingOrder = archive._metadata.readingOrder.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.transform(resource.url, "index.html", "link");
    return resource;
  });
  return {
    ...archive._metadata,
    url,
    resources: filterResources(resources),
    readingOrder: filterResources(readingOrder),
  };
}
