import { User } from '@prisma/client';
import { AccessTokenPayload, RefreshTokenPayload } from './types';
import jwt from 'jsonwebtoken';

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
