import { Names } from "./zip/names.js";
import { nanoid } from "nanoid";
import unzipper from "unzipper";
import request from "request";

export const env = {
  id: nanoid,
  request,
  names: new Names(nanoid),
  async file(path) {
    return unzipper.Open.file(path);
  },
  async url(path) {
    return unzipper.Open.url(this.request, path);
  },
  async s3(s3Client, config) {
    return unzipper.Open.s3(s3Client, config);
  },
  async buffer(data) {
    return unzipper.Open.buffer(data);
  },
};
