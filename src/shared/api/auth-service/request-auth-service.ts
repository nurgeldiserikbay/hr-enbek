import { readAuthServiceEnv } from './auth-service-env.ts';

export interface ClientContext {
  userAgent: string | null;
  forwardedFor: string | null;
  language: string;
}

export interface AuthServiceRequest {
  path: `/api/v1/${string}`;
  method?: 'GET' | 'POST';
  body?: unknown;
  accessToken?: string | undefined;
}

export interface AuthServiceResponse {
  status: number;
  body: unknown;
}

const readJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (text === '') return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const buildHeaders = (request: AuthServiceRequest, client: ClientContext, clientId: string) => {
  const headers = new Headers({
    Accept: 'application/json',
    'Accept-Language': client.language,
    'X-Client-Id': clientId,
  });
  if (client.userAgent !== null) headers.set('User-Agent', client.userAgent);
  if (client.forwardedFor !== null) headers.set('X-Forwarded-For', client.forwardedFor);
  if (request.accessToken !== undefined) headers.set('Authorization', `Bearer ${request.accessToken}`);
  if (request.body !== undefined) headers.set('Content-Type', 'application/json');
  return headers;
};

export async function requestAuthService(
  request: AuthServiceRequest,
  client: ClientContext,
): Promise<AuthServiceResponse> {
  const env = readAuthServiceEnv();
  const response = await fetch(new URL(request.path, env.AUTH_SERVICE_URL), {
    method: request.method ?? 'GET',
    headers: buildHeaders(request, client, env.AUTH_CLIENT_ID),
    cache: 'no-store',
    ...(request.body === undefined ? {} : { body: JSON.stringify(request.body) }),
  });
  return { status: response.status, body: await readJson(response) };
}
