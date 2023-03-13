import type { UploadHandler } from "@remix-run/node";
import { unstable_createMemoryUploadHandler } from "@remix-run/node";

/**
 * FIXME: 当上传文件大小超过限制时，程序会直接崩溃
 *
 * @see https://github.com/remix-run/remix/issues/2230
 */
function createUploadHandler() {
  if (!process.env.MAX_FILE_SIZE) {
    console.warn("MAX_FILE_SIZE is not set, defaulting to 20MB");
  }

  const maxPartSize = parseInt(process.env.MAX_FILE_SIZE || "20000000");

  return unstable_createMemoryUploadHandler({
    maxPartSize,
  });
}

declare global {
  var __handler: UploadHandler | undefined;
}

let handler: UploadHandler;

if (process.env.NODE_ENV === "production") {
  handler = createUploadHandler();
} else {
  if (!global.__handler) {
    global.__handler = createUploadHandler();
  }
  handler = global.__handler;
}

export { handler };
