import { safe } from "escape-html-template";

export function ifSafe(text) {
  if (text) {
    return safe(text);
  } else {
    return null;
  }
}
