Using secrets defined in dist\server\.prerender\.dev.vars
Using secrets defined in dist\server\.dev.vars

 prerendering static routes 
Failed to get static paths from the Cloudflare prerender server (500: Internal Server Error).
ReferenceError: Cannot access 'currentSite' before initialization
    at async Object.fetch (file:///H:/Kellogg/webApp-astro/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22)
  Location:
    H:\Kellogg\webApp-astro\node_modules\miniflare\dist\src\workers\core\entry.worker.js:4672:22
  Stack trace:
    at async Object.fetch (file:///H:/Kellogg/webApp-astro/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async BasicMinimalPluginContext.handler (file:///H:/Kellogg/webApp-astro/node_modules/astro/dist/core/build/static-build.js:132:11)
    at async buildEnvironments (file:///H:/Kellogg/webApp-astro/node_modules/astro/dist/core/build/static-build.js:332:3)
    at async AstroBuilder.build (file:///H:/Kellogg/webApp-astro/node_modules/astro/dist/core/build/index.js:158:5)
    at async build (file:///H:/Kellogg/webApp-astro/node_modules/astro/dist/core/build/index.js:48:3)