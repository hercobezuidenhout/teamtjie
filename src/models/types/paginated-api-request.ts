import { NextApiRequest } from 'next';

export interface PaginatedApiRequest extends NextApiRequest {
  skip: number;
  take: number;
}
