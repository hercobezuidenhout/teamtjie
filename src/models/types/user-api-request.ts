import { NextApiRequest } from 'next';

export interface UserApiRequest extends NextApiRequest {
  userId: string;
  token: string;
}
