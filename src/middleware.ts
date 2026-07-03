import { defineMiddleware } from "astro:middleware";
import { buildContentSecurityPolicy } from "@core-webApp/lib/csp";
import { currentSite } from "@site-package";

const contentSecurityPolicy = buildContentSecurityPolicy(currentSite);

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
});
