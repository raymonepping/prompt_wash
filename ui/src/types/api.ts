export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiMeta {
  timestamp?: string;
  [key: string]: unknown;
}

export interface ApiEnvelope<T> {
  status: "success" | "error";
  data: T;
  error?: ApiError;
  meta?: ApiMeta;
}
