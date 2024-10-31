import { type UserProfile } from '@spotify/web-api-ts-sdk';
import { ImageSourcePropType } from 'react-native';
import { AccessToken } from '@spotify/web-api-ts-sdk';

export interface User {
  user: UserProfile;
  token: AccessToken;
}

export const LoggedOutUser: User = {
  user: {
    display_name: '',
    email: '',
    external_urls: {
      spotify: '',
    },
    followers: {
      href: null,
      total: 0,
    },
    href: '',
    id: '',
    images: [],
    type: '',
    uri: '',
    country: '',
    explicit_content: {
      filter_enabled: false,
      filter_locked: false,
    },
    product: '',
  },
  token: {
    access_token: '',
    token_type: '',
    expires_in: 0,
    refresh_token: '',
  },
};

export const getProfilePicture = (user: User): ImageSourcePropType => {
  const userProfile = user.user;
  const uri =
    userProfile.images.length > 0
      ? userProfile.images[0].url
      : require('@/assets/images/user_icon.png');
  return { uri };
};
