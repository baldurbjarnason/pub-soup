# Notes on a software library

I still haven't settled on a final name for this.

But it's a library for working with and rendering EPUB and W3C LPF ebook files, in node.js, written in TypeScript, with 100% test coverage, with a focus on safety, metadata, and CSS suport. It supports fetching files directly from the archives from a URL, AWS S3, or a local file.

## What is this for?

Right now this library serves several different use cases, all focusing on EPUB, [LPF](https://www.w3.org/TR/lpf/), and generic Zip files:

- Metadata extraction in the form of a W3C [Publication Manifest](https://www.w3.org/TR/pub-manifest/) which is a schema.org superset for describing publications.
- Cover extraction
- Text extraction (as a single HTML)
- Safe single-page HTML rendering that's simpler and lighter weight on the front end than specialised renderers while still maintaining near-full CSS support.

It does so by using [`unzipper`](https://www.npmjs.com/package/unzipper) to open the zip archives in place and only streaming the entries as needed. If you only need the metadata, it'll only load the `container.xml` and `.opf` files without downloading the entire EPUB. If you only need the cover, it'll only load the metadata and the cover file. If you need to render HTML or SVG either as single files or as a part of a single HTML view, it'll make sure you can do that safely. It'll run `dompurify` on the markup and will use a specially made PostCSS plugin to sanitise the CSS to a allow list of properties and to process the files to work (for the most part) in the single page view.

(There are potential issues with the single page view. Mostly that the current approach can be a bit heavy on file size. That can be fixed if there is a need.)

If you render the single page view you can also get a word count for the entire ebook. If there's interest, I could turn this into a standalone method that doesn't require the sanitisation or processing that single page rendering does.

The library does this currently for EPUBs (2 and 3) and LPF archives (Audiobooks and Web Publications). It also lets you treat basic zip files as ebooks, audiobooks, or image galleries depending on whether they contain audio files, HTML, or just images.

These features have been dictated by two things:

1. They were implemented for Rebus Ink and I wanted to make sure that others could reuse that work.
2. They would be useful for a couple of projects that I'm hoping to get funded.

Once you use Publication Manifests as your internal format, supporting actual Publication Manifests is a low-hanging fruit to pick.

Neither of those give us a good sense of where this library _could_ go. The projects may or may not get funded and if they do, they may or may not need the features I expected they would. The needs of Rebus Ink also don't have any bearing on this library.

Previewing, server-side rendering, and displaying the metadata for ebooks is a bit of a niche need. Supporting standalone files broadens the use case a bit. You could, for example, use this library to safely support HTML and SVG uploads (in addition to the regular image uploads most services support). But, the role this library is going to play in the ecosystem isn't likely to be decided by what it supports today, while I'm writing this (20 September 2021). That's likely to be decided by what I decide to do next.

Until I decide that, publishing this library to `npm`, for example, would be premature.

## What could you do next?

There is a fork in the road ahead. Two paths; mutually exclusive:

1. Go deep on a single format, support everything that can be supported in a server-side context for that format.
2. Go broad and support metadata extraction, covers/thumbnails, and preview rendering for a broad set of formats.

### 1. Single format

Currently, the library supports two core formats: EPUB and LPF.

If I decide to go deep on EPUB then LPF processing will be deprecated and probably removed. While EPUB may not have conquered the world as an end user format, it is still widely used for ebook distribution and it is complex enough for it to benefit from an abstraction like this library. It would mean broader metadata support, better language and localisation support, and probably support for fixed layout EPUBs.

If I decide to go deep on LPFs and Publication Manifests then EPUB support will probably be deprecated and removed. And since there isn't much of an ecosystem for the format yet (though not nonexistent) I'd focus on implementing high-fidelity capture of existing web pages and podcasts as LPF files. Archiving was one of the proposed use cases for the format and I would basically see how far I could push that, even to the point of using JSON-LD's built-in extension mechanisms to do so if needed.

But also, yes, deeper language and localisation features and audiobook support for Publication Manifests and LPFs.

### 2. Broad format support

If I decide to go broad then there are a lot of possibilities.

- I could do DOCX metadata parsing and thumbnail extraction while delegating HTML rendering to [`mammoth`](https://www.npmjs.com/package/mammoth).
- I could reuse Rebus Ink's PDF support to add metadata parsing, thumbnail rendering, and bitmap rendering of individual pages of a PDF. (There is a note to be made here about the PDF Complexity Ratchet which is a frequent project killer but I'll save that for an actual blog post.)
- I could add support for a broad set of zip-based formats: CBZ, [textpack](http://textbundle.org/), Calibre-style HTML zip files.
- I could look into ways of supporting other office formats such as other Office Open XML formats (pptx, xlsx), probably just reusing the metadata and thumbnail extraction that I could build for DOCX.

The use case would be to provide a library that handles a broad set of arbitrary uploads. Previews and metadata would take priority over single-page HTML rendering.

## What will you do next?

Probably do a bit of research, tests really, to see what sort of demand is out there. Trawl through forums and social media to see what sort of problems people are dealing with in this domain. Write blog posts based on those observations to test hypotheses on what interests people.

Also, just plain asking people, but in my experience that rarely gives you accurate answers.

In the meantime, feel free to look through this repository. See if any of it looks useful. Let me know if you'd like me to properly document it and just publish it to `npm` as is or not.

---

## Language and localisation

W3C's [Publication Manifest](https://www.w3.org/TR/pub-manifest/) has, via JSON-LD 1.1 and schema.org, a deep set of localisation and language features.

- `inLanguage` property can set the language of the publication itself and various resources in it. Useful for resources like audio that might not have easily configurable language metadata.
- You can set the default [language and direction](https://www.w3.org/TR/pub-manifest/#manifest-lang-dir) for the manifest itself.
- Almost every string value in the manifest is [localisable](https://www.w3.org/TR/pub-manifest/#value-localizable-string). That is, it can be a string, an array of strings, a `{language, direction, value}` object, or an array of those objects.

This means that you _could_ build a publication manifest that has translated values for pretty much every property there is, in multiple languages. EPUB had similiar capabilities so if I decided to go deep on EPUB, then it could lend itself to similar features.

The goal, long term, would be to support the full set of language features, preferably by letting the API consumer pass in request headers as an optional config and let a content-negotiation library pick the appropriate language.

Right now, we only deliver the values from the JSON without normalising them. That isn't as bad as it sounds as, currently, there aren't that many files out there in the wild using the publication manifest format so most of the manifests you are going to encounter are generated by this library itself.

You can use the `settings` object to set default values for `inLanguage` and `language` properties.

## EPUB3

EPUB3 supports a refines mechanism for metadata. We don't support that yet. It's on the long term todo list. (Or, should be.)

EPUB3 has many interesting features that this library could support if there ends up being a demand for it.

- Better metadata support
- Better language and localisation support (see above)
- Fixed layout support
- Page lists (also applies to LPF/Publication manifests)
- And more.

This library ostensibly supports both EPUB2 and EPUB3 but could do a better job of both.

## ESM support

This module is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be imported instead of required.

The recommended way to use this module on Lambda is to use the Node 14 runtime, re-export this module from an `.mjs` file and then use dynamic import in the commonjs-based handler.

This library should make a distinction between preview formats (those that only generate covers and metadata) and readable formats (those that generate a full single-page HTML file).
