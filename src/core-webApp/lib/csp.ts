import type { SiteConfig } from "../types";

type CspDirectives = Record<string, string[]>;

const baseDirectives: CspDirectives = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'self'"],
  "form-action": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "media-src": ["'self'", "blob:", "https:"],
  "frame-src": ["'self'"],
  "connect-src": ["'self'", "https:", "wss:"],
};

function mergeValues(base: readonly string[], extra: readonly string[] = []) {
  return Array.from(new Set([...base, ...extra]));
}

export function buildContentSecurityPolicy(site?: Pick<SiteConfig, "security">) {
  const csp = site?.security?.csp ?? {};
  const directives: CspDirectives = {
    ...baseDirectives,
    "script-src": mergeValues(baseDirectives["script-src"], csp.scriptSrc),
    "style-src": mergeValues(baseDirectives["style-src"], csp.styleSrc),
    "font-src": mergeValues(baseDirectives["font-src"], csp.fontSrc),
    "img-src": mergeValues(baseDirectives["img-src"], csp.imgSrc),
    "media-src": mergeValues(baseDirectives["media-src"], csp.mediaSrc),
    "frame-src": mergeValues(baseDirectives["frame-src"], csp.frameSrc),
    "connect-src": mergeValues(baseDirectives["connect-src"], csp.connectSrc),
  };

  return Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");
}
