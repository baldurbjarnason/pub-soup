import { Names } from "./zip/names.js";
import { nanoid } from "nanoid";
import unzipper from "unzipper";
import request from "request";

export const env = {
  id: nanoid,
  request,
  names: new Names(() => nanoid()),
  async file(path) {
    return unzipper.Open.file(path);
  },
  async url(path) {
    return unzipper.Open.url(this.request, path);
  },
  // There is no realistic way to test S3 integration at the moment. Possibly revisit later.
  /* c8 ignore next 3 */
  async s3(s3Client, config) {
    return unzipper.Open.s3(s3Client, config);
  },
  async buffer(data) {
    return unzipper.Open.buffer(data);
  },
};
