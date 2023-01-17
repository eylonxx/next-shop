import { User } from '@prisma/client';
import { AccessToken, AccessTokenPayload, Cookies, RefreshToken, RefreshTokenPayload } from './types';
import jwt from 'jsonwebtoken';
import type { NextApiResponse } from 'next';
import { OptionsType } from 'cookies-next/lib/types';
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
function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: TokenExpiration.Refresh });
}

export function buildTokens(user: User) {
  const accessPayload: AccessTokenPayload = { userId: user.id };
  const refreshPayload: RefreshTokenPayload = { userId: user.id, version: user.tokenVersion };

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
    res.setHeader('Set-Cookie', serialize(Cookies.AccessToken, access, accessTokenCookieOptions));
  } else {
    res.setHeader('Set-Cookie', [
      serialize(Cookies.AccessToken, access, accessTokenCookieOptions),
      serialize(Cookies.RefreshToken, refresh, refreshTokenCookieOptions),
    ]);
  }
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshTokenSecret) as RefreshToken;
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, accessTokenSecret) as AccessToken;
  } catch (error) {}
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
  if (tokenVersion !== current.version) throw 'Token revoked';
  const accessPayload: AccessTokenPayload = { userId: current.userId };
  const accessToken = signAccessToken(accessPayload);

  let refreshPayload: RefreshTokenPayload | undefined;
  const expiration = new Date(current.exp * 1000);
  const now = new Date();
  const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000;
  if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
    refreshPayload = { userId: current.userId, version: tokenVersion };
  }
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

export function clearTokens(res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    serialize(Cookies.AccessToken, '', { ...defaultCookieOptions, maxAge: 0 }),
    serialize(Cookies.RefreshToken, '', { ...defaultCookieOptions, maxAge: 0 }),
  ]);
}
