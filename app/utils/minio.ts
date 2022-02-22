import { BucketItem, Client } from "minio";

const s3 = new Client({
  endPoint: process.env.S3_END_POINT || "localhost",
  port: Number(process.env.S3_PORT || "9000"),
  useSSL: process.env.S3_SSL === "true",
  accessKey: process.env.S3_ACCESS_KEY || process.env.S3_ROOT_USER || "",
  secretKey: process.env.S3_SECRET_KEY || process.env.S3_ROOT_PASSWORD || "",
});

const bucket = process.env.S3_BUCKET || "";

export function writeFile(
  filename: string,
  file: string | Buffer,
  mimetype: string = "application/octet-stream"
) {
  if (typeof file === "string") {
    return s3.fPutObject(bucket, filename, file, { mimetype });
  }
  return s3.putObject(bucket, filename, file, { mimetype });
}

export function readFile(filename: string) {
  return s3.getObject(bucket, filename);
}

export function statFile(filename: string) {
  return s3.statObject(bucket, filename);
}

export function removeFile(filename: string) {
  return s3.removeObject(bucket, filename);
}

export function removeFiles(filenames: string[]) {
  return s3.removeObjects(bucket, filenames);
}

export function readFilePartial(
  filename: string,
  offset: number,
  length: number
) {
  return s3.getPartialObject(bucket, filename, offset, length);
}

export function listDir(dirname: string) {
  return new Promise<BucketItem[]>((resolve, reject) => {
    const items: BucketItem[] = [];
    const stream = s3.listObjectsV2(bucket, dirname);
    stream.on("data", (item) => items.push(item));
    stream.on("end", () => resolve(items));
    stream.on("error", (err) => reject(err));
  });
}

export async function removeDir(dirname: string) {
  const items = await listDir(dirname);
  const filenames = items.map((item) => item.name);
  return removeFiles(filenames);
}
