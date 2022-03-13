import { BucketItem, Client } from "minio";

const s3 = new Client({
  endPoint: process.env.S3_END_POINT || "localhost",
  port: Number(process.env.S3_PORT || "9000"),
  useSSL: process.env.S3_SSL === "true",
  accessKey: process.env.S3_ACCESS_KEY || process.env.S3_ROOT_USER || "",
  secretKey: process.env.S3_SECRET_KEY || process.env.S3_ROOT_PASSWORD || "",
});

const bucket = process.env.S3_BUCKET || "";
const region = process.env.S3_REGION || "cn-north-1";

if (!bucket) {
  throw new Error("S3_BUCKET is not set");
}

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

export function readFileAsText(filename: string) {
  return new Promise<string>((resolve, reject) => {
    let data: string = "";
    s3.getObject(bucket, filename, (err, stream) => {
      if (err) reject(err);
      stream.on("data", (chunk) => (data += chunk));
      stream.on("end", () => resolve(data));
    });
  });
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

async function ensureBucketExists() {
  if (!(await s3.bucketExists(bucket))) {
    console.warn(`Bucket ${bucket} does not exist, creating...`);
    await s3.makeBucket(bucket, region);
    console.warn(`Bucket ${bucket} created.`);
  }
}

declare global {
  var __s3: boolean | undefined;
}

if (process.env.NODE_ENV === "production") {
  ensureBucketExists();
} else {
  if (!global.__s3) {
    global.__s3 = true;
    ensureBucketExists();
  }
}
