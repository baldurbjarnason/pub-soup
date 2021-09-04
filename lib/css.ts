import { purify } from "./postcss-purify/index.js";
// import cssnano from "cssnano";
import postcss from "postcss";
import prefixer from "postcss-prefix-selector";
import selectorParser from "postcss-selector-parser";
import { shiftTagName } from "./parsers/headings.js";
import { ResourceDescriptor } from "./resource.js";

const headings = ["h1", "h2", "h3", "h4", "h5"];

function processor(root) {
  root.walkTags((tagNode) => {
    if (tagNode.value === "body") {
      tagNode.replaceWith(selectorParser.tag({ value: "soup-body" }));
    } else if (tagNode.value === "html") {
      tagNode.replaceWith(selectorParser.tag({ value: "soup-html" }));
    } else if (headings.includes(tagNode.value.toLowerCase())) {
      tagNode.replaceWith(
        selectorParser.tag({ value: shiftTagName(tagNode.value) })
      );
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

export async function purifyStyles(cssString, resource: ResourceDescriptor) {
  const result = await postcss([purify(resource)]).process(cssString, {
    from: resource.url,
    to: resource.url,
  });
  return result.css;
}

export async function chapterStyles(
  cssString,
  chapterID,
  resource: ResourceDescriptor
) {
  const result = await postcss([
    purify(resource),
    // We use the attribute selector for ids here so we still have the option to use ID selectors to override publisher styles
    prefixer({ prefix: `[id="${chapterID}"]` }),
    replaceRootsWithCustomElements(),
    // cssnano({ preset: "default" }),
  ]).process(cssString, { from: resource.url, to: resource.url });
  return result.css;
}
