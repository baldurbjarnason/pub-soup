import { Names } from "../zip/names.js";
import { nanoid } from "nanoid";
import unzipper from "unzipper";
import request from "request";

const unzip = {
  async file(path) {
    return new this.Archive(await unzipper.Open.file(path), this.env);
  },
  async url(path) {
    return new this.Archive(await unzipper.Open.url(request, path), this.env);
  },
  async s3(s3Client, config) {
    return new this.Archive(await unzipper.Open.s3(s3Client, config), this.env);
  },
  async buffer(data) {
    return new this.Archive(await unzipper.Open.buffer(data), this.env);
  },
};

export const env = { id: nanoid, unzip, request, names: new Names(nanoid) };
