import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getUserMetadata, createUserMetadata } from "@/db/user";
import { type User, LoggedOutUser } from "@/types/user";

export function useAuthentication(): {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
} {
  const [user, setUser] = useState<User>(LoggedOutUser);

  useEffect(() => {
    const authStateChanged = async (
      firebaseUser: FirebaseAuthTypes.User | null,
    ) => {
      console.debug("Auth State Changed");
      if (firebaseUser === null) {
        console.debug("User Logged Out");
        // User is signed out
        setUser(LoggedOutUser);
        return;
      }
      console.debug(`User Info: ${JSON.stringify(firebaseUser)}`);
      let userMetadata = await getUserMetadata(firebaseUser.uid);
      if (userMetadata == null) {
        userMetadata = await createUserMetadata(firebaseUser.uid);
      }
      let newUser = {
        user: firebaseUser as FirebaseAuthTypes.UserInfo,
        metadata: userMetadata,
      };
      setUser(newUser);
      console.debug("User Logged In");
    };

    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      authStateChanged(firebaseUser).catch((e) => {
        console.error(e);
        setUser(LoggedOutUser);
      });
    });
    return unsubscribe;
  }, []);

  return { user, setUser };
}
