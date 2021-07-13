import { Names } from "./names.js";
import { nanoid } from "nanoid";
import unzipper from "unzipper";
import request from "request";

export const env = { nanoid, unzipper, request, names: new Names(nanoid) };
