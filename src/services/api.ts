import { createApiClient } from "../core/lib/api";
import { currentSite } from "../site-package";

export const api = createApiClient(currentSite.api);
export default api;
