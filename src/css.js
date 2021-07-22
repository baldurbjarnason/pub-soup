import { purify } from "./postcss-purify/index.js";
// import cssnano from "cssnano";
import postcss from "postcss";
import prefixer from "postcss-prefix-selector";
import selectorParser from "postcss-selector-parser";

function processor(root) {
  root.walkTags((tagNode) => {
    if (tagNode.value === "body") {
      tagNode.replaceWith(selectorParser.tag({ value: "soup-body" }));
    } else if (tagNode.value === "html") {
      tagNode.replaceWith(selectorParser.tag({ value: "soup-html" }));
    }
  });
}
const selectorProcessor = selectorParser(processor);

const replaceRootsWithCustomElements = (options = {}) => {
  return {
    postcssPlugin: "class-validator",
    Once: (root) => {
      root.walkRules((rule) => {
        rule.selector = selectorProcessor.processSync(rule.selector);
      });
    },
  };
};

export async function uploads(cssString, cssURL, file) {
  const result = await postcss([
    purify(file),
    prefixer({ prefix: `[data-stylesheets~="${cssURL}"]` }),
  ]).process(cssString, { from: file.path, to: file.path });
  return result.css;
}

export async function css(cssString, cssURL, file) {
  const result = await postcss([
    purify(file),
    prefixer({ prefix: `[data-stylesheets~="${cssURL}"]` }),
    replaceRootsWithCustomElements(),
    // cssnano({ preset: "default" }),
  ]).process(cssString, { from: file.path, to: file.path });
  return result.css;
}
