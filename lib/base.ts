export function path(path, fileBase) {
  const baseURL = new URL(fileBase, "https://www.example.com/");
  const absoluteURL = new URL(path, baseURL);
  if (absoluteURL.host !== "www.example.com") {
    return null;
  } else {
    return absoluteURL.pathname.replace("/", "");
  }
}
