import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client/index';
import { login } from '@/lib/prisma/user';
import { buildTokens, setTokens } from '@/utils/token';
// import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      let user = await login(JSON.parse(req.body));
      if (!user) {
        res.status(404).json('user not found');
        return;
      }
      const { accessToken, refreshToken } = buildTokens(user);
      setTokens(res, accessToken, refreshToken);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json(error.message);
    }
  }
}
