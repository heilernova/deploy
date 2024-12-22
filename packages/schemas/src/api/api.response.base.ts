/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse<T = any> {
    message?: string | string[];
    warning?: string | string[];
    data?: T
}



export interface ApiResponseWithData<T = any> extends ApiResponse<T> {
    data: T
}

export type JSONValue = | string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = Array<JSONValue>;
