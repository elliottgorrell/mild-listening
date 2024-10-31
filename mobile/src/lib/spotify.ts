import {
  makeRedirectUri,
  AuthRequest,
  AccessTokenRequest,
  TokenResponse,
} from 'expo-auth-session';

import { SpotifyApi, AccessToken } from '@spotify/web-api-ts-sdk';
import { User } from '@/types/user';

let spotifySdk: SpotifyApi | null = null;
const EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

export const SpotifyConfig = {
  authorizationDomain: 'https://accounts.spotify.com',
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  clientId: '01e481bb514444be82c79d8cdc6a2174',
  scopes: ['user-read-email', 'user-library-read'],
};

const redirectUri = makeRedirectUri({
  scheme: 'mildlistening',
  path: 'spotify-login-callback',
});

export const initSpotifySdk = (accessToken: AccessToken): SpotifyApi => {
  spotifySdk = SpotifyApi.withAccessToken(SpotifyConfig.clientId, accessToken);
  return spotifySdk;
};

/**
 * Retrieves the Spotify SDK instance. If the SDK has already been initialized,
 * it returns the existing instance. Otherwise, it attempts to initialize the SDK
 * using the provided user's credentials.
 *
 * @param user - Optional user object containing the Spotify user profile and access token.
 * @returns The SpotifyApi instance.
 * @throws Error if the Spotify SDK has not been initialized and no user credentials are provided.
 */
export const getSpotifySdk = (user?: User): SpotifyApi => {
  if (spotifySdk) {
    return spotifySdk;
  }
  if (user) {
    return initSpotifySdk(user.token);
  }
  throw new Error('Spotify SDK not initialized');
};

export const generateAuthCodeWithPKCEStrategy = async (): Promise<{
  code: string;
  code_verifier: string;
}> => {
  // Create a request.
  const request = new AuthRequest({
    clientId: SpotifyConfig.clientId,
    scopes: SpotifyConfig.scopes,
    usePKCE: true,
    redirectUri,
  });

  // Prompt for an auth code
  let code = null;
  const authCodeResponse = await request.promptAsync({
    authorizationEndpoint: SpotifyConfig.authorizationEndpoint,
  });
  if (authCodeResponse.type === 'success') {
    code = authCodeResponse.params.code;
    console.debug(`autorization code retrieved: ${code}`);
  } else {
    throw new Error('Something went wrong during the login process');
  }
  return {
    code,
    code_verifier: request.codeVerifier ?? '', // codeVerifier will alway be set if usePKCE is true
  };
};

export const generateAccessTokenFromAuthCode = async (
  code: string,
  code_verifier: string
): Promise<TokenResponse> => {
  const request = new AccessTokenRequest({
    code,
    redirectUri,
    clientId: SpotifyConfig.clientId,
    extraParams: { code_verifier },
  });

  try {
    const token = await request.performAsync({
      tokenEndpoint: SpotifyConfig.tokenEndpoint,
    });
    console.debug(
      `access token retrieved whichs expires_in: ${token.expiresIn}`
    );
    return token;
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong during the login process: ' + error);
  }
};

export const expoTokenToSpotifyToken = (
  expoToken: TokenResponse
): AccessToken => {
  let expires = undefined;
  if (expoToken.expiresIn) {
    expires = Date.now() + expoToken.expiresIn * 1000 - EXPIRY_BUFFER_MS;
  }
  return {
    access_token: expoToken.accessToken,
    token_type: expoToken.tokenType,
    expires_in: expoToken.expiresIn ?? 0,
    refresh_token: expoToken.refreshToken ?? '',
    expires,
  };
};
