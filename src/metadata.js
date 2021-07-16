export function toJSON(archive) {
  const meta = archive.metadata;
  const resources = meta.resources.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.media(resource.url);
    return resource;
  });
  const readingOrder = meta.readingOrder.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.media(resource.url);
    return resource;
  });
  return { ...meta, resources, readingOrder };
}
export function embed(archive) {
  const url = archive.names.get("index.html");
  return {
    ...archive.metadata,
    url,
    resources: undefined,
    readingOrder: undefined,
  };
}
