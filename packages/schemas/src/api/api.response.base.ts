export interface ApiResponse<T = unknown | undefined> {
    message?: string | string[];
    warning?: string | string[];
    data: T;
}