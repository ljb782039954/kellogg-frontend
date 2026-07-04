import { configureMedia } from "@/cms/lib/media";
import { currentSite } from "@site-package";

const apiConfig = {
  ...currentSite.api,
  useLocalBaseUrl: import.meta.env.PUBLIC_IS_LOCAL_DEV === "true" && import.meta.env.DEV,
};

configureMedia(apiConfig);

if (!currentSite.createApiClient) {
  throw new Error(`[api] Site "${currentSite.name}" does not provide an API client factory`);
}

export const api = currentSite.createApiClient(apiConfig);
export default api;
