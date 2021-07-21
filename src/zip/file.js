export class File {
  constructor({ value, path, base, contentType, id, rel = [] }) {
    this.value = value;
    this.path = path;
    this.base = base;
    this.contentType = contentType;
    this.id = id;
    this.rel = rel;
  }

  src(path) {
    return this.base.transform(path, this.path, "upload");
  }

  srcset(path) {
    return this.base.srcset(path, this.path);
  }

  href(path) {
    return this.base.transform(path, this.path, "link");
  }

  stylesheet(path) {
    return this.base.transform(path, this.path, "upload");
  }
}
