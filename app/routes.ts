import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes({
    ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
}) satisfies RouteConfig;
