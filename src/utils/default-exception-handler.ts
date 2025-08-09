import { NextApiRequest, NextApiResponse } from 'next';
import { isDescriptiveHttpException } from './is-descriptive-http-exception';
import { isHttpException } from './is-http-exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundException } from 'next-api-decorators';

const notFoundErrorCode = 'P2025';

export const defaultExceptionHandler = (
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  console.error(error);

  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === notFoundErrorCode
  ) {
    const notFoundError = new NotFoundException(error.message);
    return defaultExceptionHandler(notFoundError, req, res);
  }

  if (isDescriptiveHttpException(error)) {
    const { statusCode, description, message } = error;
    res.status(error.statusCode).json({
      statusCode,
      message,
      description,
      ...(isDevelopment ? { error } : {}),
    });
    return;
  }

  if (isHttpException(error)) {
    const { statusCode, message } = error;
    res.status(error.statusCode).json({
      statusCode,
      message,
      ...(isDevelopment ? { error } : {}),
    });
    return;
  }

  res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    description:
      'The server encountered an error and could not complete your request.',
    ...(isDevelopment ? { error } : {}),
  });
};
