import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client/index';
import { Cookies } from '@/utils/types';
import { getUserById } from '@/lib/prisma/user';
import { clearTokens, refreshTokens, setTokens, verifyRefreshToken } from '@/utils/token';
// import {  } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken]!);
      const user = await getUserById(current.userId);
      if (!user) throw 'User not found';
      const { accessToken, refreshToken } = refreshTokens(current, user.tokenVersion);
      setTokens(res, accessToken, refreshToken);
    } catch (error) {
      clearTokens(res);
    }
  }
}
