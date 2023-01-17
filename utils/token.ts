import { User } from '@prisma/client';
import { AccessTokenPayload, Cookies, RefreshTokenPayload } from './types';
import jwt from 'jsonwebtoken';
import type { NextApiResponse } from 'next';
import { OptionsType } from 'cookies-next/lib/types';
import { setCookie } from './cookies';
import { serialize } from 'cookie';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

enum TokenExpiration {
  Access = 5 * 60,
  Refresh = 7 * 24 * 60 * 60,
}

function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: TokenExpiration.Access });
}
function signRefreshToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: TokenExpiration.Access });
}

export function buildTokens(user: User) {
  const accessPayload: AccessTokenPayload = { userId: user.id };
  const refreshPayload: RefreshTokenPayload = { userId: user.id };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);
  return { accessToken, refreshToken };
}

const isProduction = process.env.NODE_ENV === 'production';

const defaultCookieOptions: OptionsType = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  domain: process.env.BASE_DOMAIN,
  path: '/',
};

const refreshTokenCookieOptions: OptionsType = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
};
const accessTokenCookieOptions: OptionsType = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
};

export function setTokens(res: NextApiResponse, access: string, refresh?: string) {
  if (!refresh) {
    // setCookie(res, Cookies.AccessToken, access, accessTokenCookieOptions);
    serialize(Cookies.AccessToken, access, accessTokenCookieOptions);
  } else {
    res.setHeader('Set-Cookie', [
      serialize(Cookies.AccessToken, access, accessTokenCookieOptions),
      serialize(Cookies.RefreshToken, refresh, refreshTokenCookieOptions),
    ]);
  }
}
