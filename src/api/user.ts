import { APICore } from "./utils";
import type { UserFilesDoc, UserProfileDoc } from "../../app/modules/user";

export function createUserAPI(core: APICore) {
  return {
    whoami() {
      return core.makePOSTRequest<UserProfileDoc>("/whoami");
    },

    signIn(username: string, password: string) {
      return core.makePOSTRequest<UserProfileDoc>("/signin", {
        username,
        password,
      });
    },

    signUp(username: string, password: string, email: string) {
      return core.makePOSTRequest<UserProfileDoc>("/signup", {
        username,
        password,
        email,
      });
    },

    uploadFile(file: File) {
      const formdata = new FormData();
      formdata.set("file", file);
      return core.makeMultipartRequest<UserFilesDoc>("/upload", formdata);
    },

    getFiles() {
      return core.makePOSTRequest<UserFilesDoc[]>("/files");
    },

    updateProfile(data: Partial<Omit<UserProfileDoc, "_id">>) {
      return core.makePUTRequest<UserProfileDoc>("/profile", data);
    },
  };
}
