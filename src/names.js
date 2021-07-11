export class Names {
  constructor(nanoid = () => "_id") {
    this.map = new Map();
    this.nanoid = nanoid;
    this.get = this.getId;
  }

  getId(path) {
    if (this.map.get(path)) {
      return this.map.get(path);
    } else {
      this.map.set(path, this.nanoid());
      return this.map.get(path);
    }
  }
}
