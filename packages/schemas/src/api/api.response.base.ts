export interface ApiResponse<T = JSONObject | JSONArray> {
    message?: string | string[];
    warning?: string | string[];
    data?: T
}



export interface ApiResponseWithData<T extends JSONObject> extends ApiResponse<T> {
    data: T
}

export type JSONValue = | string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = Array<JSONValue>;
