import { createMiddlewareDecorator, NextFunction } from 'next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';
import { PaginatedApiRequest } from '../../../models/types/paginated-api-request';

const defaultPageSize = 20;

export const Paginated = createMiddlewareDecorator(
  (req: NextApiRequest, _: NextApiResponse, next: NextFunction) => {
    (req as PaginatedApiRequest).skip = +(req.query?.skip ?? 0);
    (req as PaginatedApiRequest).take = +(req.query?.take ?? defaultPageSize);

    next();
  }
);
