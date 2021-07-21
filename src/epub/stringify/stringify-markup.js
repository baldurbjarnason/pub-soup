export function renderMarkup(markup, linear = true) {
  const stylesheets = markup.links
    .filter((link) => link.rel.includes("stylesheet"))
    .map((link) => link.url)
    .concat(markup.id);

  return `<soup-chapter data-stylesheets="${stylesheets.join(" ")}" id="${
    markup.id
  }" data-path="${markup.path}" data-title="${markup.title}" ${
    (markup.inLanguage && `lang="${markup.inLanguage}"`) || ""
  }${nonLinearAttributes(linear)} data-rel="${markup.rel.join(" ")}">
  <soup-html>${markup.content}</soup-html>
</soup-chapter>`;
}

function nonLinearAttributes(linear) {
  if (linear) {
    return ``;
  } else {
    return ' data-linear="false" hidden';
  }
}

export function renderImage(file) {
  return `<soup-image id="${file.id}" data-title="${file.title}" data-path="${
    file.path
  }"${nonLinearAttributes(true)} data-rel="${file.rel.join(" ")}">
  <soup-html><img src="${file.href}" alt="${
    file.title
  }" loading="lazy"></soup-html>
</soup-image>`;
}

export function renderStyles(styles) {
  return styles
    .filter((style) => !style.url)
    .map((style) => {
      return `<style>${style}</style>
`;
    })
    .join("");
}

export function renderStylesheets(links) {
  return links
    .filter((link) => link.rel && link.rel.includes("stylesheet"))
    .map((style) => {
      return `<link rel="stylesheet" href="${style.url}">
`;
    })
    .join("");
}
