import unzipper from "unzipper";
import got from "got";
import directory from "unzipper/lib/Open/directory.js";

export interface Env {
  file: (string) => any;
  url: (string) => any;
  s3: (arg0: any, arg1: any) => any;
  buffer: (path) => any;
}

export const env: Env = {
  async file(path) {
    return unzipper.Open.file(path);
  },
  async url(path) {
    const source = {
      async size() {
        const { headers } = await got.head(path);
        // Possibly revisit later.
        /* c8 ignore next 3 */
        if (!headers["content-length"]) {
          throw new Error("Missing content length header");
        } else {
          return headers["content-length"];
        }
      },
      stream(offset, length = "") {
        const headers = {
          range: "bytes=" + offset + "-" + length,
        };
        return got.stream.get(path, {
          headers,
        });
      },
    };
    return directory(source);
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