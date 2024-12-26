export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type OmitBy<T, K extends keyof T> = Omit<T, K>;

export type PartialWithout<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type OmitWithout<T, K extends keyof T> = Omit<T, keyof T> & Pick<T, K>;

export type ConvertDateToString<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K] 
}