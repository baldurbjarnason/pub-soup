import { Resource, ResourceDescriptor } from "../../resource.js";

export function renderMarkup(markup: Resource, linear = true) {
  return `<soup-chapter id="${markup.id()}" data-path="${
    markup.url
  }" data-title="${markup.name}" ${
    (markup.inLanguage && `lang="${markup.inLanguage}"`) || ""
  }${nonLinearAttributes(linear)} data-rel="${markup.rel.join(" ")}">
  <soup-html>${markup.value}</soup-html>
</soup-chapter>`;
}

function nonLinearAttributes(linear) {
  if (linear) {
    return ``;
  } else {
    return ' data-linear="false" hidden';
  }
}

export function renderImage(file: Resource) {
  return `<soup-image id="${file.id()}" data-title="${file.name}" data-path="${
    file.url
  }"${nonLinearAttributes(true)} data-rel="${file.rel.join(" ")}" hidden>
  <soup-html><img src="${file.url}" alt="${
    file.name
  }" loading="lazy"></soup-html>
</soup-image>`;
}
