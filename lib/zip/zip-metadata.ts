import mime from "mime";
import { asPublication } from "../../lib/metadata.js";
import { Resource } from "../../lib/resource.js";

export function extractZipMeta(zip) {
  const directory = zip.directory;
  // Should check if there is a publication.json or content.opf and process those instead if available.
  const url = zip.url;
  const resources = directory.files.map((file) => {
    const encodingFormat =
      mime.getType(file.path) || "application/octet-stream";
    return new Resource({ encodingFormat, url: file.path });
  });
  const html = resources.filter(
    (file) =>
      file.encodingFormat === "text/html" ||
      file.encodingFormat === "application/xhtml+xml"
  );
  const images = resources.filter((file) =>
    file.encodingFormat.startsWith("image/")
  );
  const metadata: {
    resources: any[];
    type?: string[];
    readingOrder?: any[];
    name: string;
    url: string;
  } = { resources, url, name: url };
  if (html.length !== 0) {
    metadata.type = ["Book"];
    metadata.readingOrder = html.sort((a, b) => a.url.localeCompare(b.url));
  } else if (html.length === 0 && images.length !== 0) {
    metadata.type = ["CreativeWork"];
    metadata.readingOrder = images.sort((a, b) => a.url.localeCompare(b.url));
  }
  if (images[0]) {
    images[0].rel = ["cover"];
  }
  return asPublication(metadata);
}
