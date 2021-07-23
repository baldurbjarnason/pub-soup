import html from "escape-html-template";
import { ifSafe } from "./ifsafe.js";
export function meta(context) {
  return (
    ifSafe(context.metaHTML) ||
    html`
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>${context.metadata.name}</title>

      ${context.description
        ? html` <meta
              name="description"
              content="${context.description}"
            /><meta
              property="og:description"
              content="${context.description}"
            />`
        : ""}
      <meta property="og:title" content="${context.metadata.name}" />
      <meta property="og:image" content="${context.cover}" />
      <meta
        property="og:image:alt"
        content="Cover image for ${context.metadata.name}"
      />
      <meta property="og:locale" content="${context.metadata.inLanguage}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:url" content="${context.path}" />
      ${context.canonical
        ? html`<link rel="canonical" href="${context.canonical}" />`
        : ""}
      ${context.faviconMain
        ? html`<link rel="icon" href="${context.faviconMain}" />`
        : ""}
      ${context.faviconSVG
        ? html`<link rel="icon" href="${context.faviconSVG}" />`
        : ""}
      ${context.appleIcon
        ? html`<link rel="icon" href="${context.appleIcon}" />`
        : ""}
      ${context.manifestURL
        ? html`<link rel="icon" href="${context.manifestURL}" />`
        : ""}
      <meta name="theme-color" content="#FFFFFF" />
    `
  );
}
