11:23:08 [build] directory: H:\Kellogg\webApp-astro\dist\
11:23:08 [build] adapter: @astrojs/cloudflare
11:23:08 [build] Collecting build info...
11:23:08 [build] ✓ Completed in 10.54s.
11:23:08 [build] Building server entrypoints...
Using secrets defined in .env
Using secrets defined in .env.local
11:23:15 [vite] ✓ built in 7.55s
Using secrets defined in .env
Using secrets defined in .env.local
11:23:22 [vite] ✓ built in 6.32s
11:23:26 [WARN] [vite] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
11:23:26 [vite] ✓ built in 4.68s
Default inspector port 9229 not available, using 9230 instead

Using secrets defined in dist\server\.prerender\.dev.vars
Using secrets defined in dist\server\.dev.vars

 prerendering static routes 
Failed to get static paths from the Cloudflare prerender server (500: Internal Server Error).
Error: Network connection lost.
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