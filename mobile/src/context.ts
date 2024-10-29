import { type Dispatch, type SetStateAction, createContext } from "react";

import { type User, LoggedOutUser } from "./types/user";

export interface CurrentUserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const CurrentUserContext = createContext<CurrentUserContextType>({
  user: LoggedOutUser,
} as CurrentUserContextType);
