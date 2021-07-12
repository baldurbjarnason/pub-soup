export class Base {
  constructor({ media, link, style, base } = {}) {
    base = base || "http://www.example.com/";
    this.base = {
      base: base,
      media: media || base,
      link: link || base,
      style: style || base,
    };
  }

  href(url) {
    return this.serialize(new URL(url, this.base.base));
  }

  serialize(url = new URL(this.base.base)) {
    if (url.hostname === "www.example.com") {
      return url.pathname;
    } else {
      return url.href;
    }
  }

  media(url) {
    return this.serialize(new URL(url, this.base.media));
  }

  link(url) {
    return this.serialize(new URL(url, this.base.link));
  }

  style(url) {
    return this.serialize(new URL(url, this.base.style));
  }
}
