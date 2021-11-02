import axios, { AxiosResponse, Method } from "axios";
import type { Errors } from "../../app/errors";

/**
 * Standard API Response data to a request
 * http response status.
 * 200 to be ok, and data will be given.
 * others to be fail, and error message will be given.
 *
 * ```text
 * { status: 200, error: "", data: { ... } }
 * { status: 404, error: "no_found", data: null }
 * ```
 */
export type APIResponse<T> = {
  status: number;
  error: Errors | "";
  data: T;
};

export type APICoreConfig = Partial<{
  cookie: string;
  host: string;
  language: string;
}>;

/**
 * Create a API request core
 */
export const createAPICore = (config?: APICoreConfig) => {
  const request = axios.create({
    baseURL: (config?.host ?? "") + "/api",
    validateStatus() {
      return true;
    },
    headers: config?.cookie ? { Cookie: config.cookie } : {},
  });

  const makeRequest = async <T = Record<string, never>>(
    response: Promise<AxiosResponse>
  ): Promise<APIResponse<T>> => {
    try {
      const res = await response;
      if (typeof res.data === "object") {
        return {
          status: res.status,
          error: "",
          data: res.data as T,
        };
      }
      return {
        status: res.status,
        error: "core/internal_server_error",
        data: res.data,
      };
    } catch (e) {
      return {
        status: 500,
        error: "core/internal_server_error",
        data: {} as T,
      };
    }
  };

  const makeJSONRequest = (method: Method) => {
    return <T = Record<string, never>, D = Record<string, unknown>>(
      url: string,
      data?: D,
      headers?: Record<string, string>
    ) => {
      return makeRequest<T>(
        request.request({
          url,
          method,
          data: JSON.stringify(data ?? {}),
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        })
      );
    };
  };

  /**
   * Create a multipart request
   * @param url request url
   * @param formdata request data
   * @param callback on upload progress event callback
   * @param method defaults to POST
   */
  const makeMultipartRequest = <T = Record<string, never>>(
    url: string,
    formdata: FormData,
    callback?: (progressEvent: any) => void,
    method: Method = "POST"
  ) => {
    return makeRequest<T>(
      request.request({
        method,
        url,
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: callback,
      })
    );
  };

  return {
    makeGETRequest: makeJSONRequest("GET"),
    makePOSTRequest: makeJSONRequest("POST"),
    makePUTRequest: makeJSONRequest("PUT"),
    makeDELETERequest: makeJSONRequest("DELETE"),
    makeMultipartRequest,
    makeJSONRequest,
  };
};

export type APICore = ReturnType<typeof createAPICore>;
