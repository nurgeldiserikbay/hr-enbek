import { z } from 'zod';

export const SERVICE_UNAVAILABLE_CODE = 'auth.service.unavailable';

const apiErrorBodySchema = z.object({
  code: z.string(),
  message: z.string().catch(''),
  errors: z.record(z.string(), z.string()).optional(),
});

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: Readonly<Record<string, string>>;

  constructor(status: number, body: unknown) {
    const parsed = apiErrorBodySchema.safeParse(body);
    super(parsed.success ? parsed.data.message : '');
    this.name = 'ApiError';
    this.status = status;
    this.code = parsed.success ? parsed.data.code : SERVICE_UNAVAILABLE_CODE;
    this.fieldErrors = parsed.success ? (parsed.data.errors ?? {}) : {};
  }
}

export const describeApiError = (error: unknown, fallback: string): string =>
  error instanceof ApiError && error.code !== SERVICE_UNAVAILABLE_CODE && error.message !== ''
    ? error.message
    : fallback;

export const hasErrorCode = (error: unknown, code: string): boolean => error instanceof ApiError && error.code === code;

const readBody = async (response: Response): Promise<unknown> => {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
};

export async function readApiResponse(response: Response): Promise<unknown> {
  const body = await readBody(response);
  if (!response.ok) throw new ApiError(response.status, body);
  return body;
}
