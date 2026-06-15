import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "a", "blockquote", "br", "code", "del", "em", "h1", "h2", "h3", "h4",
  "h5", "h6", "hr", "img", "li", "ol", "p", "pre", "span", "strong",
  "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "ul",
];

export function sanitizeCmsHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "srcset", "sizes", "alt", "title", "width", "height", "loading"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: attribs.target === "_blank"
          ? { ...attribs, rel: "noopener noreferrer" }
          : attribs,
      }),
      img: (_tagName, attribs) => ({
        tagName: "img",
        attribs: { ...attribs, loading: attribs.loading || "lazy" },
      }),
    },
  });
}
