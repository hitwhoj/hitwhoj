import { unstable_createMemoryUploadHandler } from "remix";

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
  var __uploadHandler:
    | ReturnType<typeof unstable_createMemoryUploadHandler>
    | undefined;
}

let uploadHandler: ReturnType<typeof unstable_createMemoryUploadHandler>;

if (process.env.NODE_ENV === "production") {
  uploadHandler = createUploadHandler();
} else {
  if (!global.__uploadHandler) {
    global.__uploadHandler = createUploadHandler();
  }
  uploadHandler = global.__uploadHandler;
}

export { uploadHandler };
