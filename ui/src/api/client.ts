import type { ApiEnvelope } from "../types/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:3000/api";

function buildUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

async function parseEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new Error(`Request failed with status ${response.status}`);
  }
}

async function requestEnvelope<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });

  const envelope = await parseEnvelope<T>(response);

  if (!response.ok || envelope.status !== "success") {
    throw new Error(
      envelope.error?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return envelope;
}

export function getEnvelope<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  return requestEnvelope<T>(path, {
    ...init,
    method: "GET",
  });
}

export function postEnvelope<TResponse, TBody>(
  path: string,
  body: TBody,
  init: RequestInit = {},
): Promise<ApiEnvelope<TResponse>> {
  return requestEnvelope<TResponse>(path, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    body: JSON.stringify(body),
  });
}
