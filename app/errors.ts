export type Errors =
  | "core/database_panicked"
  | "core/storage_panicked"
  | "core/internal_server_error"
  | "storage/file_not_exist"
  | "storage/permission_denied"
  | "common/wrong_arguments"
  | "user/not_exist"
  | "user/exist"
  | "user/login_required"
  | "user/logout_required"
  | "user/password_wrong"
  | "user/invalid_username"
  | "user/permission_denied";
