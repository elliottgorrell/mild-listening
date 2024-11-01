import { type User } from '@/types/user';
import { AccessToken } from '@spotify/web-api-ts-sdk';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const storeUser = (user: User) => {
  try {
    const userJsonValue = JSON.stringify(user.user);
    const tokenJsonValue = JSON.stringify(user.token);
    storage.set('@user', userJsonValue);
    storage.set('@token', tokenJsonValue);
    console.debug(`Saved user ${user.user.display_name} to local storage`);
  } catch (e) {
    console.error(e);
  }
};

export const deleteUser = () => {
  try {
    storage.delete('@user');
    storage.delete('@token');
    console.debug('Removed user from local storage');
  } catch (e) {
    console.error(e);
  }
};

export const fetchUser = (): User | null => {
  try {
    const userJsonValue = storage.getString('@user');
    const tokenJsonValue = storage.getString('@token');

    if (!userJsonValue || !tokenJsonValue) return null;

    return {
      user: JSON.parse(userJsonValue),
      token: JSON.parse(tokenJsonValue),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const storeToken = (token: AccessToken) => {
  try {
    const jsonValue = JSON.stringify(token);
    storage.set('@token', jsonValue);
    console.debug(`Saved new spotify access token to local storage`);
    if (token.expires) {
      console.debug(
        `New Token expires in ${token.expires - Date.now() / 1000} seconds`
      );
    }
  } catch (e) {
    console.error(e);
  }
};

export const fetchToken = (): AccessToken | null => {
  try {
    const jsonValue = storage.getString('@token');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const clearData = () => {
  storage.clearAll();
};

export const dump = (): Object => {
  return storage.toJSON();
};
