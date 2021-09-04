import { testProp } from "./allowed-css-props.js";
import values from "postcss-value-parser";
import validDataUrl from "valid-data-url";
import { ResourceDescriptor } from "../resource.js";
import { path } from "../base.js";

// Some of the ideas here are from https://github.com/eramdam/postcss-sanitize/blob/master/index.js MIT License

const deleteEmptyRules = (rule) => {
  if (rule.nodes.length === 0) rule.remove();
};

export function purify(resource: ResourceDescriptor) {
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

        // We need to remove all external urls
        // At a later date we might allow external https urls
        const parsed = values(decl.value);
        parsed.walk((node) => {
          if (node.type === "function" && node.value === "url") {
            node.nodes = node.nodes
              .map((urlNode) => {
                const full = path(urlNode.value, resource.url);
                if (!full && !validDataUrl(urlNode.value)) {
                  return null;
                } else {
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
