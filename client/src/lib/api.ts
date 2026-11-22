import { ApiErrorBody } from '../types.js';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (response.status === 204) return { success: true } as T;

  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: T; error?: ApiErrorBody }
    | null;

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      response.status,
      payload?.error?.code ?? 'REQUEST_FAILED',
      payload?.error?.message ?? 'Something went wrong. Please try again.'
    );
  }

  return payload.data as T;
}
