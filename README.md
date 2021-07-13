# pub-soup

## ESM support

This module is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be imported instead of required.

The recommended way to use this module on Lambda is to use the Node 14 runtime, re-export this module from an `.mjs` file and then use dynamic import in the commonjs-based handler.
