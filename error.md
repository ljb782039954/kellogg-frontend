
PS H:\Kellogg\webApp-astro> npm run dev

> webapp-astro@0.0.1 dev
> astro dev

(node:17240) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
21:53:20 [@astrojs/cloudflare] Enabling image processing with Cloudflare Images for production with the "IMAGES" Images binding.
21:53:20 [@astrojs/cloudflare] Enabling sessions with Cloudflare KV with the "SESSION" KV binding.
Using secrets defined in .env
Using secrets defined in .env.local
21:53:23 [ERROR] [vite] service core:user:kellogg-frontend: This Worker requires compatibility date "2026-07-05", but the newest date supported by this server binary is "2026-05-15".
The Workers runtime failed to start. There is likely additional logging output above.
  Location:
    H:\Kellogg\webApp-astro\node_modules\miniflare\dist\src\index.js:89159:13
  Stack trace:
    at #assembleAndUpdateConfig (H:\Kellogg\webApp-astro\node_modules\miniflare\dist\src\index.js:89159:13)
    at async Mutex.runWith (H:\Kellogg\webApp-astro\node_modules\miniflare\dist\src\index.js:58149:48)
    at async _Miniflare.dispatchFetch (H:\Kellogg\webApp-astro\node_modules\miniflare\dist\src\index.js:89402:5)
    at async Promise.all (index 0)
    at async _createServer (file:///H:/Kellogg/webApp-astro/node_modules/vite/dist/node/chunks/config.js:25622:86)