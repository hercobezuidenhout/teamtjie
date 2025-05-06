import { NextApiRequest } from 'next';

export interface SlackApiRequest extends NextApiRequest {
  token?: string;
}
