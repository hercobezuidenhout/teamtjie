import { NextApiRequest } from 'next';

export interface UpdateScopeRoleRequest extends NextApiRequest {
  userId: string;
  role: string;
}
