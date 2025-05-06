import { HttpError } from '@/utils/http-utils';
import { hasProperty } from '@/utils/type-guard-utils';

interface DescriptiveError {
  statusCode: number;
  message: string;
  description?: string;
}

const isDescriptiveError = (object: unknown): object is DescriptiveError =>
  hasProperty<DescriptiveError>(object, 'statusCode', Number) &&
  hasProperty<DescriptiveError>(object, 'message', String);

const defaultErrorMessage = 'Something went wrong';

const handleResponse = async <T = unknown>(response: Response): Promise<T | undefined> => {
  if (!response.ok) {
    const body = (await response.json()) as unknown;
    const message = isDescriptiveError(body)
      ? body.description ?? body.message
      : defaultErrorMessage;
    throw new HttpError(response, message);
  }

  if (response.status === 204) {
    return;
  }

  return response.json() as T;
};

const makeRequest = async <T = unknown, D = unknown>(
  path: string,
  method: 'DELETE' | 'GET' | 'POST' | 'PUT',
  data?: D,
  config?: RequestOptions
): Promise<T | undefined> => {
  const isFormData = data instanceof FormData;
  const body = data ? (isFormData ? data : JSON.stringify(data)) : config?.body;
  const contentTypeHeader = !isFormData
    ? { 'Content-Type': 'application/json' }
    : undefined;
  const url = config?.baseUrl ? new URL(path, config.baseUrl) : path;

  const requestConfig: RequestInit = {
    ...config,
    method,
    headers: {
      ...config?.headers,
      ...contentTypeHeader,
    },
    body,
  };

  const response = await fetch(url, requestConfig);
  return handleResponse<T>(response);
};

export interface RequestOptions extends RequestInit {
  baseUrl?: string;
}

export const deleteCallback = async <T = void>(
  url: string,
  config?: RequestOptions
): Promise<T | undefined> => makeRequest<T>(url, 'DELETE', undefined, config);

export const get = async <T = unknown>(
  url: string,
  config?: RequestOptions
): Promise<T | undefined> => makeRequest<T>(url, 'GET', undefined, config);

export const post = async <T = unknown, D = unknown | undefined>(
  url: string,
  data?: D,
  config?: RequestOptions
): Promise<T | undefined> => makeRequest<T>(url, 'POST', data, config);

export const put = async <D, T = unknown>(
  url: string,
  data: D,
  config?: RequestOptions
): Promise<T | undefined> => makeRequest<T>(url, 'PUT', data, config);
