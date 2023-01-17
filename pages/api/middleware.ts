import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAccessToken } from '@/utils/token';
import { Cookies } from '@/utils/types';
export function middleware(req: NextApiRequest, res: NextApiResponse) {
  const token = verifyAccessToken(req.cookies[Cookies.AccessToken]!);
  if (!token) {
    res.status(401);
    return new Error('Not signed in');
  }
  // res.locals.token =
}
export const config = {
  matcher: ['/logout', '/user'],
};
