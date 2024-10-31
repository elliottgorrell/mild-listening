import * as WebBrowser from 'expo-web-browser';

import { Button, type ButtonProps } from '@/components/button';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { User } from '@/types/user';

import {
  generateAuthCodeWithPKCEStrategy,
  generateAccessTokenFromAuthCode,
  expoTokenToSpotifyToken,
  initSpotifySdk,
} from '@/lib/spotify';

WebBrowser.maybeCompleteAuthSession();

interface SpotifyLoginButtonProps extends ButtonProps {
  onLoginSuccess: (spotifySdk: SpotifyApi, user: User) => void;
}

export const SpotifyLoginButton = ({
  onLoginSuccess,
  ...props
}: SpotifyLoginButtonProps) => {
  const onButtonClick = async (): Promise<void> => {
    const { code, code_verifier } = await generateAuthCodeWithPKCEStrategy();
    const accessTokenResponse = await generateAccessTokenFromAuthCode(
      code,
      code_verifier
    );
    const accessToken = expoTokenToSpotifyToken(accessTokenResponse);

    const spotifyApi = initSpotifySdk(accessToken);

    const userProfile = await spotifyApi.currentUser.profile();
    const user = {
      user: userProfile,
      token: accessToken,
    };
    onLoginSuccess(spotifyApi, user);
  };

  return <Button {...props} onPress={onButtonClick} />;
};
