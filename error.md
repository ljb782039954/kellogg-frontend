2026-07-08T02:59:50.337Z	Initializing build environment...
2026-07-08T02:59:53.441Z	Success: Finished initializing build environment
2026-07-08T02:59:54.279Z	Cloning repository...
2026-07-08T02:59:57.914Z	Restoring from dependencies cache
2026-07-08T02:59:57.917Z	Restoring from build output cache
2026-07-08T02:59:57.923Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-07-08T02:59:58.236Z	Success: Build output restored from build cache.
2026-07-08T03:00:03.372Z	Success: Dependencies restored from build cache.
2026-07-08T03:00:03.385Z	Installing project dependencies: npm clean-install --progress=false
2026-07-08T03:00:39.681Z	
2026-07-08T03:00:39.682Z	added 366 packages, and audited 367 packages in 34s
2026-07-08T03:00:39.682Z	
2026-07-08T03:00:39.682Z	160 packages are looking for funding
2026-07-08T03:00:39.682Z	  run `npm fund` for details
2026-07-08T03:00:39.865Z	
2026-07-08T03:00:39.866Z	11 vulnerabilities (2 low, 1 moderate, 8 high)
2026-07-08T03:00:39.866Z	
2026-07-08T03:00:39.866Z	To address all issues, run:
2026-07-08T03:00:39.866Z	  npm audit fix
2026-07-08T03:00:39.866Z	
2026-07-08T03:00:39.866Z	Run `npm audit` for details.
2026-07-08T03:00:40.380Z	Executing user build command: npm run build
2026-07-08T03:00:41.372Z	
2026-07-08T03:00:41.373Z	> webapp-astro@0.0.1 build
2026-07-08T03:00:41.373Z	> astro build
2026-07-08T03:00:41.373Z	
2026-07-08T03:00:46.288Z	03:00:46 [@astrojs/cloudflare] Enabling image processing with Cloudflare Images for production with the "IMAGES" Images binding.
2026-07-08T03:00:46.289Z	03:00:46 [@astrojs/cloudflare] Enabling sessions with Cloudflare KV with the "SESSION" KV binding.
2026-07-08T03:00:57.164Z	03:00:57 [types] Generated 10.76s
2026-07-08T03:00:57.165Z	03:00:57 [build] output: "static"
2026-07-08T03:00:57.165Z	03:00:57 [build] mode: "server"
2026-07-08T03:00:57.165Z	03:00:57 [build] directory: /opt/buildhome/repo/dist/
2026-07-08T03:00:57.165Z	03:00:57 [build] adapter: @astrojs/cloudflare
2026-07-08T03:00:57.165Z	03:00:57 [build] Collecting build info...
2026-07-08T03:00:57.166Z	03:00:57 [build] ✓ Completed in 10.88s.
2026-07-08T03:00:57.167Z	03:00:57 [build] Building server entrypoints...
2026-07-08T03:01:09.598Z	03:01:09 [vite] ✓ built in 12.34s
2026-07-08T03:01:24.107Z	03:01:24 [vite] ✓ built in 14.50s
2026-07-08T03:01:31.883Z	03:01:31 [WARN] [vite] 
2026-07-08T03:01:31.884Z	(!) Some chunks are larger than 500 kB after minification. Consider:
2026-07-08T03:01:31.884Z	- Using dynamic import() to code-split the application
2026-07-08T03:01:31.884Z	- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2026-07-08T03:01:31.884Z	- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2026-07-08T03:01:31.884Z	03:01:31 [vite] ✓ built in 7.77s
2026-07-08T03:01:31.932Z	Default inspector port 9229 not available, using 9230 instead
2026-07-08T03:01:31.932Z	
2026-07-08T03:01:31.969Z	
2026-07-08T03:01:31.969Z	 prerendering static routes 
2026-07-08T03:01:34.158Z	Failed to get static paths from the Cloudflare prerender server (500: Internal Server Error).
2026-07-08T03:01:34.159Z	ReferenceError: fixedPageIds is not defined
2026-07-08T03:01:34.159Z	    at async Object.fetch (file:///opt/buildhome/repo/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22)
2026-07-08T03:01:34.159Z	  Location:
2026-07-08T03:01:34.160Z	    /opt/buildhome/repo/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22
2026-07-08T03:01:34.160Z	  Stack trace:
2026-07-08T03:01:34.160Z	    at async Object.fetch (file:///opt/buildhome/repo/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22)
2026-07-08T03:01:34.160Z	    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
2026-07-08T03:01:34.160Z	    at async BasicMinimalPluginContext.handler (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/static-build.js:132:11)
2026-07-08T03:01:34.160Z	    at async buildEnvironments (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/static-build.js:332:3)
2026-07-08T03:01:34.160Z	    at async AstroBuilder.build (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/index.js:158:5)
2026-07-08T03:01:34.160Z	    at async build (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/index.js:48:3)
2026-07-08T03:01:34.418Z	Failed: error occurred while running build command