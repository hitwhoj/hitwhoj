import db from "../db";
import { File } from "../router";
import { EmptyResult, err, ok, randomString, Result } from "../utils";
import { Storage } from "./storage";
import mimetypes from "mime-types";
import { IMetadata } from "../minio";

export type UserPasswordDoc = {
  _id: string;
  password: string;
};

export type UserProfileDoc = {
  _id: string;
  email: string;
  displayName: string;
};

export type UserSessionDoc = {
  _id: string;
  cookie: string;
  expires: Date;
};

export type UserFilesDoc = {
  username: string;
  uuid: string;
  filename: string;
  size: number;
};

const collPassword = db.collection<UserPasswordDoc>("user/password");
const collProfile = db.collection<UserProfileDoc>("user/profile");
const collSession = db.collection<UserSessionDoc>("user/session");
const collFiles = db.collection<UserFilesDoc>("user/files");

export class Users {
  /**
   * Sign up a new user
   */
  static async addUser(
    username: string,
    password: string,
    email: string
  ): Promise<Result<UserProfileDoc>> {
    const find = await collPassword.findOne({ _id: username });
    if (find) return err("user/exist");

    const result1 = await collPassword.insertOne({ _id: username, password });
    if (!result1.acknowledged) return err("core/database_panicked");

    const profile = { _id: username, email, displayName: "" };
    const result2 = await collProfile.insertOne(profile);
    if (!result2.acknowledged) return err("core/database_panicked");

    return ok(profile);
  }

  /**
   * Get a user's profile.
   * Returns `user/not_exist` if user is not exist
   */
  static async getUserProfile(
    username: string
  ): Promise<Result<UserProfileDoc>> {
    const result = await collProfile.findOne({ _id: username });
    if (!result) return err("user/not_exist");

    return ok(result);
  }

  /**
   * Get a bunch of user's profile.
   * Returns `user/not_exist` if any of the given user was not found in the list
   */
  static async getUserProfileList(
    username: string[]
  ): Promise<Result<Array<UserProfileDoc>>> {
    const result = await collProfile.find({ _id: { $in: username } }).toArray();
    if (result.length !== username.length) {
      return err("user/not_exist");
    }
    return ok(result);
  }

  /**
   * Change user's profile
   */
  static async changeUserProfile(
    username: string,
    profile: Partial<Omit<UserProfileDoc, "_id">>
  ): Promise<Result<UserProfileDoc>> {
    const result = await collProfile.findOneAndUpdate(
      { _id: username },
      { $set: profile }
    );
    if (!result.ok || !result.value) return err("core/database_panicked");

    return ok(result.value);
  }

  /**
   * Verify if the user's password is correct.
   * Returns `user/not_exist` if user is not even exist
   */
  static async verifyUser(
    username: string,
    password: string
  ): Promise<Result<boolean>> {
    const find = await collPassword.findOne({ _id: username });
    if (!find) return err("user/not_exist");
    return ok(find.password === password);
  }

  /**
   * Delete a user
   */
  static async deleteUser(username: string): Promise<EmptyResult> {
    await collPassword.deleteOne({ _id: username });
    await collProfile.deleteOne({ _id: username });
    await collSession.deleteOne({ _id: username });

    return;
  }

  /**
   * Find if a cookie reflects to someone
   * @returns username or null
   */
  static async findCookie(cookie: string): Promise<string | null> {
    const find = await collSession.findOne({ cookie });
    if (!find) return null;

    if (find.expires < new Date()) {
      await collSession.deleteOne(find);
      return null;
    }

    return find._id;
  }

  /**
   * Issue a new cookie to username.
   * The old one will be revoked immediately.
   * @returns cookie or null
   */
  static async issueCookie(
    username: string,
    expires: Date
  ): Promise<string | null> {
    const cookie = randomString(36);

    const result = await collSession.findOneAndUpdate(
      { _id: username },
      {
        $set: { expires, cookie },
      },
      { upsert: true }
    );

    if (!result.ok) return null;

    return cookie;
  }

  /**
   * Create a file
   * @returns uuid
   */
  static async createPrivateFile(username: string, file: File) {
    const uuid = randomString(16);
    const filename = `/user/${username}/${uuid}`;
    const mimetype =
      (file.name && mimetypes.lookup(file.name)) || "application/octet-stream";
    const meta: IMetadata = {
      contenttype: file.type ?? mimetype,
      filename: file.name || uuid,
    };

    const result1 = await Storage.writeFile(filename, file.path, meta);
    if (result1) return result1;

    const userFile: UserFilesDoc = {
      username,
      uuid,
      size: file.size,
      filename: file.name || uuid,
    };
    const result2 = await collFiles.insertOne(userFile);
    if (!result2.acknowledged) return err("core/database_panicked");

    return ok(userFile);
  }

  /**
   * Get files of a user
   */
  static async getUserFiles(username: string) {
    return collFiles.find({ username }).toArray();
  }
}
