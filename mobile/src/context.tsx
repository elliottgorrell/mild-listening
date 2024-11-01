import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useEffect,
} from 'react';
import { type User, LoggedOutUser } from '@/types/user';
import { fetchUser, storeUser, clearData } from '@/lib/localStorage';

export interface CurrentUserContextType {
  user: User;
  signIn: (user: User) => void;
  signOut: () => void;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const CurrentUserContext = createContext<CurrentUserContextType>({
  user: LoggedOutUser,
} as CurrentUserContextType);

export const CurrentUserProvider: React.FC<PropsWithChildren> = (props) => {
  const [user, setUser] = useState<User>(LoggedOutUser);

  useEffect(() => {
    console.debug('Fetching logged in user from local storage');
    const storedUser = fetchUser();
    if (storedUser) {
      console.debug(`rehydrating user: ${JSON.stringify(storedUser)}`);
      setUser(storedUser);
    } else {
      console.debug('No user found in local storage');
    }
  }, []);

  const signIn = (user: User): void => {
    setUser(user);
    storeUser(user);
    console.info(`Logged in as ${user.user.display_name}`);
  };

  const signOut = (): void => {
    console.info('Logged out');
    setUser(LoggedOutUser);
    clearData();
    console.debug('Wiped Local storage');
  };

  // We ensure the state value actually exists before letting the children render
  // If waiting for some data to load, we may render a spinner, text, or something useful instead of null
  if (!user) return null;

  return (
    <CurrentUserContext.Provider value={{ user, signIn, signOut }}>
      {props.children}
    </CurrentUserContext.Provider>
  );
};

// This hook is used for consuming the context.
// I usually add a check to make sure it can only be used within the provider.
export const useCurrentUserContext = () => {
  const ctx = useContext(CurrentUserContext);
  if (!ctx)
    throw new Error('useSomeContext must be used within CurrentUserProvider');
  return ctx;
};
