import AsyncStorage from '@react-native-async-storage/async-storage';
import { type User } from '@/types/user';
import { AccessToken } from '@spotify/web-api-ts-sdk';

export const storeUser = async (user: User) => {
  try {
    const userJsonValue = JSON.stringify(user.user);
    const tokenJsonValue = JSON.stringify(user.token);
    await AsyncStorage.setItem('@user', userJsonValue);
    await AsyncStorage.setItem('@token', tokenJsonValue);
    console.debug(`Saved user ${user.user.display_name} to local storage`);
  } catch (e) {
    console.error(e);
  }
};

export const deleteUser = async () => {
  try {
    await AsyncStorage.removeItem('@user');
    await AsyncStorage.removeItem('@token');
    console.debug('Removed user from local storage');
  } catch (e) {
    console.error(e);
  }
};

export const fetchUser = async (): Promise<User | null> => {
  try {
    const userJsonValue = await AsyncStorage.getItem('@user');
    const tokenJsonValue = await AsyncStorage.getItem('@token');

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

export const storeToken = async (token: AccessToken) => {};
