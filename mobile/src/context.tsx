import {
  type Dispatch,
  type SetStateAction,
  createContext,
  PropsWithChildren,
  useState,
  useContext,
} from 'react';

import { type User, LoggedOutUser } from './types/user';

export interface CurrentUserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const CurrentUserContext = createContext<CurrentUserContextType>({
  user: LoggedOutUser,
} as CurrentUserContextType);

export const CurrentUserProvider: React.FC<PropsWithChildren> = (props) => {
  const [user, setUser] = useState<User>(LoggedOutUser);

  // We ensure the state value actually exists before letting the children render
  // If waiting for some data to load, we may render a spinner, text, or something useful instead of null
  if (!user) return null;

  return (
    <CurrentUserContext.Provider value={{ user, setUser }}>
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