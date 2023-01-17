import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client/index';
import { login } from '@/lib/prisma/user';
import { setCookie } from '@/utils/cookies';
import { buildTokens, setTokens } from '@/utils/token';
// import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      let user: unknown = await login(JSON.parse(req.body));
      if (!user) throw Error;
      console.log('before build');

      const { accessToken, refreshToken } = buildTokens(user as User);
      console.log('access set', accessToken, 'refresh', refreshToken);

      setTokens(res, accessToken, refreshToken);

      // setCookie(res, 'token', 'testtt', { path: '/', maxAge: 2592000 });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json(error.message);
    }
  }
}
