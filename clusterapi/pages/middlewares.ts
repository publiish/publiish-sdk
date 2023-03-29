import { withCors } from "../lib/middlewares/corsMiddleware";
import { stackMiddlewares } from "../lib/middlewares/stackedMiddlewares";

const middlewares = [withCors];
export default stackMiddlewares(middlewares);

export const config = {
  matcher: "/api/:path*",
};
