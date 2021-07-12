import { Names } from "./names.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const nanoid = require("nanoid");
const unzipper = require("unzipper");
const request = require("request");

export const env = { nanoid, unzipper, request, names: new Names(nanoid) };
