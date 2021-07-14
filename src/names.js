import { extname, basename } from "path";

export class Names {
  constructor(nanoid = () => "_id") {
    this.map = new Map();
    this.nanoid = nanoid;
    this.get = this.getId;
  }

  id(path) {
    return this.getId(path, true);
  }

  // Always include file type suffix?
  getId(path, id = false) {
    const ext = extname(path);
    let name = this.map.get(path);
    if (!name) {
      this.map.set(path, this.nanoid());
      name = this.map.get(path);
    }
    if (id) {
      return name;
    } else {
      return name + ext;
    }
  }
}
