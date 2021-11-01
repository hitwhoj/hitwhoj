import {
  writeFile as _writeFile,
  statFile as _statFile,
  readFile as _readFile,
  readFilePartial as _readFilePartial,
  MyBucketItem,
  IMetadata,
} from "../minio";
import fs from "fs/promises";
import type { Readable } from "stream";
import { EmptyResult, err, ok, Result } from "../utils";

export class Storage {
  /**
   * Write file into storage
   */
  static async writeFile(
    filename: string,
    file: string | Buffer | Readable,
    meta: IMetadata = {}
  ): Promise<EmptyResult> {
    try {
      await _writeFile(filename, file, meta);
      if (typeof file === "string") {
        await fs.unlink(file);
      }
    } catch (e) {
      return err("core/storage_panicked");
    }
  }

  /**
   * Stat a file in storage
   */
  static async statFile(filename: string): Promise<Result<MyBucketItem>> {
    try {
      return ok(await _statFile(filename));
    } catch (e) {
      return err("storage/file_not_exist");
    }
  }

  /**
   * Read a file from storage, you must make sure it exists
   */
  static async readFile(filename: string): Promise<Result<Readable>> {
    try {
      return ok(await _readFile(filename));
    } catch (e) {
      return err("core/storage_panicked");
    }
  }

  static async readFilePartial(
    filename: string,
    start: number,
    length: number
  ) {
    try {
      return ok(await _readFilePartial(filename, start, length));
    } catch (e) {
      return err("core/storage_panicked");
    }
  }
}
