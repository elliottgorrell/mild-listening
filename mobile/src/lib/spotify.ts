import {
  makeRedirectUri,
  AuthRequest,
  AccessTokenRequest,
  TokenResponse,
} from 'expo-auth-session';

import { SpotifyApi, AccessToken } from '@spotify/web-api-ts-sdk';

let spotifySdk: SpotifyApi | null = null;

const authorizationDomain = 'https://accounts.spotify.com';
const authorizationEndpoint = `${authorizationDomain}/authorize`;
const tokenEndpoint = `${authorizationDomain}/api/token`;

const redirectUri = makeRedirectUri({
  scheme: 'mildlistening',
  path: 'spotify-login-callback',
});

export const initSpotifySdk = (
  clientId: string,
  accessToken: AccessToken
): SpotifyApi => {
  spotifySdk = SpotifyApi.withAccessToken(clientId, accessToken);
  return spotifySdk;
};

export const getSpotifySdk = (): SpotifyApi => {
  if (!spotifySdk) {
    throw new Error('Spotify SDK not initialized');
  }
  return spotifySdk;
};

export const generateAuthCodeWithPKCEStrategy = async (
  clientId: string,
  scopes: string[]
): Promise<{
  code: string;
  code_verifier: string;
}> => {
  // Create a request.
  const request = new AuthRequest({
    clientId,
    scopes,
    usePKCE: true,
    redirectUri,
  });

  // Prompt for an auth code
  let code = null;
  const authCodeResponse = await request.promptAsync({
    authorizationEndpoint,
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
  clientId: string,
  code: string,
  code_verifier: string
): Promise<TokenResponse> => {
  // Grab an access token
  const request = new AccessTokenRequest({
    code,
    redirectUri,
    clientId,
    extraParams: { code_verifier },
  });

  const token = await request.performAsync({
    tokenEndpoint,
  });

  return token;
};

export const expoTokenToSpotifyToken = (
  expoToken: TokenResponse
): AccessToken => {
  return {
    access_token: expoToken.accessToken,
    token_type: expoToken.tokenType,
    expires_in: expoToken.expiresIn ?? 0,
    refresh_token: expoToken.refreshToken ?? '',
  };
};
