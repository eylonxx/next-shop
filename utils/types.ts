export interface AccessTokenPayload {
  userId: string;
}
export interface RefreshTokenPayload {
  userId: string;
}
export enum Cookies {
  AccessToken = 'access',
  RefreshToken = 'refresh',
}
