// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// import { User } from '../../node_modules/.prisma/client/index';
import { User } from '@prisma/client/index';
import { login } from '@/lib/prisma/user';
import { setCookie } from '@/utils/cookies';
import { buildTokens } from '@/utils/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      let user: unknown = await login(JSON.parse(req.body));
      if (user instanceof User) {
        const { accessToken, refreshToken } = buildTokens(user);
      }

      setCookie(res, 'token', 'testtt', { path: '/', maxAge: 2592000 });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json(error.message);
    }
  }
}