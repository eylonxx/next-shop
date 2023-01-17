import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client/index';
import { login } from '@/lib/prisma/user';
import { buildTokens, clearTokens, setTokens } from '@/utils/token';
// import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    clearTokens(res);
  }
}
