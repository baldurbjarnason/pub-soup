import { base } from "./base.html.js";

// Process file into context object

export function render(context) {
  return base(context).toString();
}
