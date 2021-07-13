import { testProp } from "./allowed-css-props.js";
import values from "postcss-value-parser";
import validDataUrl from "valid-data-url";

// Some of the ideas here are from https://github.com/eramdam/postcss-sanitize/blob/master/index.js MIT License

const deleteEmptyRules = (rule) => {
  if (rule.nodes.length === 0) rule.remove();
};

export function purify(file) {
  return {
    postcssPlugin: "postcss-purify",
    Once: (css) => {
      // We don't support @import rules at the moment. May do so later.
      css.walkAtRules("import", (rule) => {
        rule.remove();
      });

      css.walkDecls((decl) => {
        if (!testProp(decl.prop, decl.value)) {
          decl.remove();
        }

        const parsed = values(decl.value);
        parsed.walk((node) => {
          if (node.type === "function" && node.value === "url") {
            node.nodes = node.nodes
              .map((urlNode) => {
                const full = file.base.full(urlNode.value);
                if (!full && !validDataUrl(urlNode.value)) {
                  return null;
                } else if (validDataUrl(urlNode.value)) {
                  return urlNode;
                } else {
                  urlNode.value = file.src(urlNode.value);
                  return urlNode;
                }
              })
              .filter((item) => item);
          }
        });
        const result = parsed.toString();
        if (result === "url()") {
          decl.remove();
        } else {
          decl.value = result;
        }
      });

      css.walkRules((rule) => deleteEmptyRules(rule));
    },
  };
}
