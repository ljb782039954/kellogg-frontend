2026-07-14T09:19:21.116Z	Initializing build environment...
2026-07-14T09:19:23.191Z	Success: Finished initializing build environment
2026-07-14T09:19:23.825Z	Cloning repository...
2026-07-14T09:19:25.113Z	Restoring from dependencies cache
2026-07-14T09:19:25.115Z	Restoring from build output cache
2026-07-14T09:19:25.118Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-07-14T09:19:25.482Z	Success: Build output restored from build cache.
2026-07-14T09:19:26.325Z	Success: Dependencies restored from build cache.
2026-07-14T09:19:26.331Z	Installing project dependencies: npm clean-install --progress=false
2026-07-14T09:19:42.063Z	
2026-07-14T09:19:42.063Z	added 366 packages, and audited 367 packages in 15s
2026-07-14T09:19:42.063Z	
2026-07-14T09:19:42.063Z	160 packages are looking for funding
2026-07-14T09:19:42.063Z	  run `npm fund` for details
2026-07-14T09:19:42.175Z	
2026-07-14T09:19:42.175Z	11 vulnerabilities (2 low, 1 moderate, 8 high)
2026-07-14T09:19:42.175Z	
2026-07-14T09:19:42.175Z	To address all issues, run:
2026-07-14T09:19:42.176Z	  npm audit fix
2026-07-14T09:19:42.176Z	
2026-07-14T09:19:42.176Z	Run `npm audit` for details.
2026-07-14T09:19:42.395Z	Executing user build command: npm run build
2026-07-14T09:19:43.196Z	
2026-07-14T09:19:43.197Z	> webapp-astro@0.0.1 build
2026-07-14T09:19:43.197Z	> astro build
2026-07-14T09:19:43.197Z	
2026-07-14T09:19:45.656Z	09:19:45 [@astrojs/cloudflare] Enabling image processing with Cloudflare Images for production with the "IMAGES" Images binding.
2026-07-14T09:19:45.657Z	09:19:45 [@astrojs/cloudflare] Enabling sessions with Cloudflare KV with the "SESSION" KV binding.
2026-07-14T09:19:50.557Z	09:19:50 [types] Generated 4.87s
2026-07-14T09:19:50.557Z	09:19:50 [build] output: "static"
2026-07-14T09:19:50.557Z	09:19:50 [build] mode: "server"
2026-07-14T09:19:50.557Z	09:19:50 [build] directory: /opt/buildhome/repo/dist/
2026-07-14T09:19:50.557Z	09:19:50 [build] adapter: @astrojs/cloudflare
2026-07-14T09:19:50.557Z	09:19:50 [build] Collecting build info...
2026-07-14T09:19:50.557Z	09:19:50 [build] ✓ Completed in 4.90s.
2026-07-14T09:19:50.558Z	09:19:50 [build] Building server entrypoints...
2026-07-14T09:19:53.987Z	09:19:53 [ERROR] [vite] ✗ Build failed in 3.37s
2026-07-14T09:19:54.013Z	src/site-package/kellogg/pages/ProductDetailPage.astro (5:9): "ProductCardStatic" is not exported by "src/site-package/kellogg/components/base/index.ts", imported by "src/site-package/kellogg/pages/ProductDetailPage.astro".
2026-07-14T09:19:54.013Z	file: /opt/buildhome/repo/src/site-package/kellogg/pages/ProductDetailPage.astro:5:9
2026-07-14T09:19:54.013Z	
2026-07-14T09:19:54.013Z	3: import ProductDetailView from "./productDetail/ProductDetailView";
2026-07-14T09:19:54.013Z	4: import VideoEmbed, { getVideoEmbedSource } from "@/runtime/components/VideoEmbed";
2026-07-14T09:19:54.013Z	5: import { ProductCardStatic as ProductCard, ProductCustomFields, SectionHeader } from "../components/base";
2026-07-14T09:19:54.013Z	            ^
2026-07-14T09:19:54.013Z	6: import { PageService } from "@core-webApp/services/pageService";
2026-07-14T09:19:54.014Z	7: import { api } from "@services/api";
2026-07-14T09:19:54.014Z	
2026-07-14T09:19:54.014Z	  Location:
2026-07-14T09:19:54.014Z	    /opt/buildhome/repo/src/site-package/kellogg/pages/ProductDetailPage.astro:5:9
2026-07-14T09:19:54.014Z	  Stack trace:
2026-07-14T09:19:54.014Z	    at getRollupError (file:///opt/buildhome/repo/node_modules/rollup/dist/es/shared/parseAst.js:406:41)
2026-07-14T09:19:54.014Z	    at Module.error (file:///opt/buildhome/repo/node_modules/rollup/dist/es/shared/node-entry.js:17390:16)
2026-07-14T09:19:54.014Z	    at ModuleScope.findVariable (file:///opt/buildhome/repo/node_modules/rollup/dist/es/shared/node-entry.js:15413:39)
2026-07-14T09:19:54.014Z	    at FunctionBodyScope.findVariable (file:///opt/buildhome/repo/node_modules/rollup/dist/es/shared/node-entry.js:5682:38)
2026-07-14T09:19:54.014Z	    at FunctionBodyScope.findVariable (file:///opt/buildhome/repo/node_modules/rollup/dist/es/shared/node-entry.js:5682:38)
2026-07-14T09:19:54.090Z	Failed: error occurred while running build command