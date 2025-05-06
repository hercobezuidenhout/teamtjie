export class HttpError extends Error {
  status: number;

  constructor(response: Response, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = response.status;
  }
}

export const getErrorMessage = (object: unknown): string | undefined => {
  if (object instanceof Response) {
    return object.status >= 200 && object.status < 300
      ? undefined
      : object.statusText;
  }

  if (object instanceof Error) {
    return object.message;
  }

  return undefined;
};

export const getErrorDescription = (object: unknown) => {
  if (object instanceof Error) {
    return object.message;
  }
  return undefined;
};

export const getStatusCode = (object: unknown) => {
  if (object instanceof HttpError) {
    return object.status;
  }

  if (object instanceof Response) {
    return object.status;
  }

  return undefined;
};

export const isSuccessResponse = (object: unknown) => {
  const statusCode = getStatusCode(object);
  return !!statusCode && statusCode >= 200 && statusCode < 300;
};

export const isNotFoundResponse = (object: unknown) =>
  getStatusCode(object) === 404;

export const isBadRequestResponse = (object: unknown) =>
  getStatusCode(object) === 400;

export const isUnauthorizedResponse = (object: unknown) =>
  getStatusCode(object) === 401;

export const isForbiddenResponse = (object: unknown) =>
  getStatusCode(object) === 403;

export const isInternalServerErrorResponse = (object: unknown) =>
  getStatusCode(object) === 500;

export const isConflictResponse = (object: unknown) =>
  getStatusCode(object) === 409;

export const isUnprocessableEntityResponse = (object: unknown) =>
  getStatusCode(object) === 422;
