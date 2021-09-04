export class Resource implements ResourceDescriptor {
  type?: string;
  value?: Buffer | string;
  url: string;
  encodingFormat: string;
  id?: string;
  rel?: string[];
  inLanguage?: string;
  _meta?: {
    [key: string]: any;
  };
  constructor({
    type,
    value,
    url,
    encodingFormat,
    id,
    rel = [],
    _meta,
    inLanguage,
  }: ResourceDescriptor) {
    this.type = type;
    this.value = value;
    this.url = url;
    this.encodingFormat = encodingFormat;
    this.id = id;
    this.rel = rel;
    this._meta = _meta;
    this.inLanguage = inLanguage;
  }
}

export interface ResourceDescriptor {
  value?: Buffer | string;
  type?: string;
  url: string;
  encodingFormat: string;
  id?: string;
  rel?: string[];
  inLanguage?: string;
  _meta?: {
    [key: string]: any;
  };
}
