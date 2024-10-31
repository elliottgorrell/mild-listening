import * as WebBrowser from 'expo-web-browser';

import { Button, type ButtonProps } from '@/components/button';
import { SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';

import {
  generateAuthCodeWithPKCEStrategy,
  generateAccessTokenFromAuthCode,
  expoTokenToSpotifyToken,
  initSpotifySdk,
} from '@/lib/spotify';

WebBrowser.maybeCompleteAuthSession();

interface SpotifyLoginButtonProps extends ButtonProps {
  clientId: string;
  scopes: string[];
  onLoginSuccess: (spotifySdk: SpotifyApi, user: UserProfile) => void;
}

export const SpotifyLoginButton = ({
  clientId,
  scopes,
  onLoginSuccess,
  ...props
}: SpotifyLoginButtonProps) => {
  const onButtonClick = async (): Promise<void> => {
    const { code, code_verifier } = await generateAuthCodeWithPKCEStrategy(
      clientId,
      scopes
    );
    const accessTokenResponse = await generateAccessTokenFromAuthCode(
      clientId,
      code,
      code_verifier
    );

    const spotifyApi = initSpotifySdk(
      clientId,
      expoTokenToSpotifyToken(accessTokenResponse)
    );

    const user = await spotifyApi.currentUser.profile();
    onLoginSuccess(spotifyApi, user);
  };

  return <Button {...props} onPress={onButtonClick} />;
};
