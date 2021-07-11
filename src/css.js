import { purify } from "./postcss-purify/index.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const postcss = require("postcss");
const prefixer = require("postcss-prefix-selector");
const selectorParser = require("postcss-selector-parser");

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

export async function css(cssString, base, prefix = "#pub-soup") {
  const result = await postcss([
    purify({ base }),
    prefixer({ prefix }),
    replaceRootsWithCustomElements(),
  ]).process(cssString, { from: base, to: base });
  return result.css;
}
