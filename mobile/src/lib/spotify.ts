import {
  makeRedirectUri,
  AuthRequest,
  AccessTokenRequest,
  TokenResponse,
} from 'expo-auth-session';

import {
  SpotifyApi,
  AccessToken,
  IAuthStrategy,
  ICachable,
  SdkConfiguration,
  ICachingStrategy,
} from '@spotify/web-api-ts-sdk';
import { User } from '@/types/user';
import { storage } from './localStorage';
import { type ICacheStore, GenericCache } from '@spotify/web-api-ts-sdk';

let spotifySdk: SpotifyApi | null = null;

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
  const config = { cachingStrategy: new LocalStorageCachingStrategy() };
  const strategy = new ProvidedPKCETokenStrategy(
    SpotifyConfig.clientId,
    accessToken
  );
  spotifySdk = new SpotifyApi(strategy, config);

  console.debug('Spotify SDK initialized');
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
  return {
    access_token: expoToken.accessToken,
    token_type: expoToken.tokenType,
    expires_in: expoToken.expiresIn ?? 0,
    refresh_token: expoToken.refreshToken ?? '',
    expires: undefined,
  };
};

class LocalStorageCachingStrategy extends GenericCache {
  constructor() {
    console.debug('Initializing LocalStorageCachingStrategy');
    super(new LocalStorageCacheStore());
  }
}

class LocalStorageCacheStore implements ICacheStore {
  public get(key: string): string | null {
    console.debug(`Retrieving ${key} from local storage`);

    const val = storage.getString(key) ?? null;
    console.debug(`val: ${val}`);

    return val;
  }

  public set(key: string, value: string): void {
    console.debug(`Storing ${key} with value ${value} in local storage`);
    storage.set(key, value);
  }

  public remove(key: string): void {
    console.debug(`Removing ${key} from local storage`);
    storage.delete(key);
  }
}

export default class ProvidedPKCETokenStrategy implements IAuthStrategy {
  private static readonly cacheKey = 'spotify-sdk:token';
  private configuration: SdkConfiguration | null = null;
  private initalToken: AccessToken;
  protected get cache(): ICachingStrategy {
    return this.configuration!.cachingStrategy;
  }

  constructor(
    protected clientId: string,
    token: AccessToken
  ) {
    console.debug('Initializing ProvidedPKCETokenStrategy');
    this.clientId = clientId;
    this.initalToken = AccessTokenHelpers.toCachable(token);
  }

  public setConfiguration(configuration: SdkConfiguration): void {
    this.configuration = configuration;
  }

  public async getOrCreateAccessToken(): Promise<AccessToken> {
    const token = await this.cache.getOrCreate<AccessToken>(
      ProvidedPKCETokenStrategy.cacheKey,
      async () => {
        // We should never be creating access tokens
        const token = await this.getAccessToken();
        if (!token) {
          console.debug(
            'must be first run with strategy so storing token provided to constructor'
          );
          this.cache.setCacheItem(
            ProvidedPKCETokenStrategy.cacheKey,
            this.initalToken
          );
          return this.initalToken;
        }
        return token;
      },
      async (expiring) => {
        return AccessTokenHelpers.refreshCachedAccessToken(
          this.clientId,
          expiring
        );
      }
    );

    return token;
  }

  public async getAccessToken(): Promise<AccessToken | null> {
    const token = await this.cache.get<AccessToken>(
      ProvidedPKCETokenStrategy.cacheKey
    );
    return token;
  }

  public removeAccessToken(): void {
    this.cache.remove(ProvidedPKCETokenStrategy.cacheKey);
  }
}

class AccessTokenHelpers {
  public static async refreshCachedAccessToken(
    clientId: string,
    item: AccessToken
  ) {
    const updated = await AccessTokenHelpers.refreshToken(
      clientId,
      item.refresh_token
    );
    return AccessTokenHelpers.toCachable(updated);
  }

  public static toCachable(item: AccessToken): ICachable & AccessToken {
    // If it already has a calculated expires value it is good to go
    if (item.expires) {
      return item;
    }

    return { ...item, expires: this.calculateExpiry(item) };
  }

  public static calculateExpiry(item: AccessToken) {
    return Date.now() + item.expires_in * 1000;
  }

  private static async refreshToken(
    clientId: string,
    refreshToken: string
  ): Promise<AccessToken> {
    console.debug(`Refreshing token with refresh token: ${refreshToken}`);
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const text = await result.text();

    if (!result.ok) {
      throw new Error(`Failed to refresh token: ${result.statusText}, ${text}`);
    }

    const json: AccessToken = JSON.parse(text);
    return json;
  }
}
