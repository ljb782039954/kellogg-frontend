/// <reference types="astro/client" />

import type { SiteData } from "@services/siteService";

declare namespace App {
  interface Locals {
    siteDataPromise?: Promise<SiteData>;
  }
}

declare global {
  interface Window {
    __EXCHANGE_RATES__?: Record<string, number>;
  }
}
