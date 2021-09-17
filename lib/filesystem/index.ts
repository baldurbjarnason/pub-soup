import got from "got";
import { env, Env } from "../env.js";
import { EpubFactory } from "../epub/index.js";
import { ZipFactory } from "../zip/index.js";
import { LpfFactory } from "../lpf/index.js";
import * as path from "path";
import mime from "mime";
import { Resource } from "../resource.js";

const formats = {
  "application/zip": new ZipFactory(env),
  "application/x-zip-compressed": new ZipFactory(env),
  "application/epub+zip": new EpubFactory(env),
  "application/lpf+zip": new LpfFactory(env),
};

export async function s3(s3Client, options, myEnv = env) {
  const response = await s3Client.headObject(options).promise();
  const encodingFormat = response.ContentType;
  if (formats[encodingFormat]) {
    return formats[encodingFormat].s3(s3Client, options, myEnv);
  }
}

export async function file(url, options?, myEnv = env) {
  const suffix = path.extname(url);
  const encodingFormat =
    suffix === ".lpf" ? "application/lpf+zip" : mime.getType(url);
  if (formats[encodingFormat]) {
    return formats[encodingFormat].file(url, options, myEnv);
  }
}

export async function url(path, options, myEnv = env) {
  try {
    const response = await got.head(path);
    const encodingFormat = response.headers["content-type"];
    if (formats[encodingFormat]) {
      return formats[encodingFormat].url(path, options, myEnv);
    }
  } catch (err) {
    return null;
  }
}
