// middlewares/withHeaders.ts
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { MiddlewareFactory } from "./types";

export const withCors: MiddlewareFactory = (next: NextMiddleware) => {
  return async (_request: NextRequest, _next: NextFetchEvent) => {
    const response = NextResponse.next();

    response.headers.set("access-control-allow-headers", "*");
    response.headers.set("access-control-allow-methods", "*");
    response.headers.set("access-control-allow-origin", "*");

    return response;
  };
};
