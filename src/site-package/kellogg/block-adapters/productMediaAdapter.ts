import { getSafeVideoSource } from "@core-webApp/lib/video";
import type { ProductVideoSource } from "../components/base";
import { kelloggSiteConfig } from "../config";

export function toProductVideoSource(url?: string): ProductVideoSource | null {
  if (!url) return null;

  const source = getSafeVideoSource(url, {
    assetsBase: kelloggSiteConfig.api.assetsBaseUrl,
    providers: kelloggSiteConfig.security?.videoProviders,
  });

  return source
    ? {
        kind: source.kind,
        url: source.url,
        vertical: source.kind === "embed" ? source.vertical : undefined,
        title: "Product Video",
      }
    : null;
}

export function toProductVideoSources(urls: string[] = []): ProductVideoSource[] {
  return urls
    .map((url) => toProductVideoSource(url))
    .filter((source): source is ProductVideoSource => Boolean(source));
}
