export function renderMarkup(markup) {
  const stylesheets = markup.links
    .filter((link) => link.rel.includes("stylesheet"))
    .map((link) => link.url);

  return `<soup-chapter data-stylesheets="${stylesheets.join(" ")}" id="${
    markup.id
  }" data-path="${markup.path}" data-title="${markup.title}" ${
    markup.inLanguage && `lang="${markup.inLanguage}"`
  }>
  <soup-html>${markup.content}</soup-html>
</soup-chapter>`;
}

export function renderStyles(styles) {
  return styles
    .map((style) => {
      return `<style>${style}</style>
`;
    })
    .join("");
}
