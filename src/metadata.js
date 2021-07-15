export function toJSON(meta, archive) {
  const resources = meta.resources.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.media(resource.url);
  });
  const readingOrder = meta.readingOrder.map((resource) => {
    resource = Object.assign({}, resource);
    resource.url = archive.base.media(resource.url);
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
