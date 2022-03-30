import { BucketItem, Client } from "minio";

function readableToBuffer(stream: NodeJS.ReadableStream) {
  let data: any[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on("data", (chunk) => data.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(data)));
    stream.on("error", (err) => reject(err));
  });
}

class S3 {
  private client: Client;
  private bucket: string;
  private region: string;

  constructor() {
    const endPoint = process.env.S3_END_POINT || "localhost";
    const port = parseInt(process.env.S3_PORT || "9000");
    const useSSL = process.env.S3_SSL === "true";
    const accessKey =
      process.env.S3_ACCESS_KEY || process.env.S3_ROOT_USER || "";
    const secretKey =
      process.env.S3_SECRET_KEY || process.env.S3_ROOT_PASSWORD || "";
    const bucket = process.env.S3_BUCKET || "";
    const region = process.env.S3_REGION || "cn-north-1";

    if (!bucket) {
      throw new Error("S3_BUCKET is not set");
    }

    if (!accessKey || !secretKey) {
      console.warn("S3_ACCESS_KEY or S3_SECRET_KEY is not set");
    }

    this.client = new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
      region,
    });
    this.bucket = bucket;
    this.region = region;
  }

  /**
   * 复制本地文件到 MinIO 中
   */
  copyFile(
    filename: string,
    srcfile: string,
    mimetype: string = "application/octet-stream"
  ) {
    return this.client.fPutObject(this.bucket, filename, srcfile, { mimetype });
  }

  /**
   * 写入 Buffer 到 MinIO 中
   */
  writeFile(
    filename: string,
    buffer: Buffer | string,
    mimetype: string = "application/octet-stream"
  ) {
    if (typeof buffer === "string") {
      buffer = Buffer.from(buffer);
    }
    return this.client.putObject(this.bucket, filename, buffer, { mimetype });
  }

  /**
   * 读取整个文件
   */
  readFile(filename: string) {
    return this.client.getObject(this.bucket, filename);
  }

  /**
   * 读取部分文件
   */
  readFilePartial(filename: string, offset: number, length: number) {
    return this.client.getPartialObject(this.bucket, filename, offset, length);
  }

  /**
   * 以 Buffer 形式读取文件
   */
  async readFileAsBuffer(filename: string) {
    return await readableToBuffer(await this.readFile(filename));
  }

  /**
   * 以 Buffer 形式读取部分文件
   */
  async readFilePartialAsBuffer(
    filename: string,
    offset: number,
    length: number
  ) {
    return await readableToBuffer(
      await this.readFilePartial(filename, offset, length)
    );
  }

  /**
   * 检查文件
   */
  statFile(filename: string) {
    return this.client.statObject(this.bucket, filename);
  }

  /**
   * 删除文件
   */
  removeFile(filename: string) {
    return this.client.removeObject(this.bucket, filename);
  }

  /**
   * 删除多个文件
   */
  removeFiles(filenames: string[]) {
    return this.client.removeObjects(this.bucket, filenames);
  }

  /**
   * 列出目录下所有文件
   */
  listDir(dirname: string) {
    return new Promise<BucketItem[]>((resolve, reject) => {
      const items: BucketItem[] = [];
      const stream = this.client.listObjectsV2(this.bucket, dirname);
      stream.on("data", (item) => items.push(item));
      stream.on("end", () => resolve(items));
      stream.on("error", (err) => reject(err));
    });
  }

  /**
   * 删除整个目录
   */
  async removeDir(dirname: string) {
    const items = await this.listDir(dirname);
    const filenames = items.map((item) => item.name);
    return this.removeFiles(filenames);
  }

  /**
   * 创建 Bucket 如果不存在
   */
  async ensureBucket() {
    if (!(await this.client.bucketExists(this.bucket))) {
      console.warn(`Bucket ${this.bucket} does not exist, creating...`);
      await this.client.makeBucket(this.bucket, this.region);
      console.warn(`Bucket ${this.bucket} created.`);
    }
  }
}

declare global {
  var __s3: S3 | undefined;
}

let s3: S3;

if (process.env.NODE_ENV === "production") {
  s3 = new S3();
  s3.ensureBucket();
} else {
  if (!global.__s3) {
    global.__s3 = new S3();
    global.__s3.ensureBucket();
  }
  s3 = global.__s3;
}

export { s3 };
