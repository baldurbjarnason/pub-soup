import { settings } from "../env.js";
import { isString } from "./isString.js";

export function asValue(value) {
  if (value.value) {
    return {
      language: settings.get("language"),
      direction: settings.get("direction"),
      ...value,
    };
  } else {
    return {
      value,
      language: settings.get("language"),
      direction: settings.get("direction"),
    };
  }
}
