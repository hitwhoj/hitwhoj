import { unstable_createMemoryUploadHandler, UploadHandler } from "remix";

/**
 * FIXME: 当上传文件大小超过限制时，程序会直接崩溃
 *
 * @see https://github.com/remix-run/remix/issues/2230
 */
function createUploadHandler() {
  if (!process.env.MAX_FILE_SIZE) {
    console.warn("MAX_FILE_SIZE is not set, defaulting to 20MB");
  }

  const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "20000000");

  return unstable_createMemoryUploadHandler({
    maxFileSize,
  });
}

declare global {
  var __uploadHandler: UploadHandler | undefined;
}

let uploadHandler: UploadHandler;

if (process.env.NODE_ENV === "production") {
  uploadHandler = createUploadHandler();
} else {
  if (!global.__uploadHandler) {
    global.__uploadHandler = createUploadHandler();
  }
  uploadHandler = global.__uploadHandler;
}

export { uploadHandler };
