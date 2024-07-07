export type actionResult<T> = T | null | undefined
export type pagination = { perPage: number; total: number; page: number, lastPage: number }
export type actionResultPagination<T> = { pagination: pagination, items: T[] } | null | undefined