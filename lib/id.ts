import { encode } from "universal-base64url";

export function getId(path: string, hash?: string) {
  if (hash) {
    return `id${encode(path)}:${encode(hash)}`;
  } else {
    return `id${encode(path)}`;
  }
}
