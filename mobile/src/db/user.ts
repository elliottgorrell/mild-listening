import firestore from "@react-native-firebase/firestore";
import { OnboardingStage, type UserMetadata, type User } from "@/types/user";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { type CurrentUserContextType } from "@/context";
const collectionName = "users";

const defaultUserMetadata = {
  onboardingStage: OnboardingStage.Welcome,
};

export async function getUserMetadata(
  uid: string,
): Promise<UserMetadata | null> {
  console.debug(`fetching user from firestore with uid: ${uid}`);
  const userDocument = await firestore()
    .collection(collectionName)
    .doc(uid)
    .get();

  if (userDocument.exists) {
    const user = userDocument.data() as UserMetadata;
    user.uid = uid;
    return user;
  } else {
    return null;
  }
}

export async function createUserMetadata(uid: string): Promise<UserMetadata> {
  console.debug(`creating a new user`);
  const currUser = await getUserMetadata(uid);

  if (currUser !== null) {
    throw new Error("User already exists");
  }
  await firestore()
    .collection(collectionName)
    .doc(uid)
    .set({ ...defaultUserMetadata });

  const user = await getUserMetadata(uid);
  if (user === null) {
    throw new Error("Couldn't retrieve user after creation");
  }

  return user;
}

export interface UserMetadataUpdate {
  onboardingStage?: OnboardingStage;
}

/**
 * This updates the user in firestore and also requires the setState dispatcher for react to make sure these don't fall out of sync
 * TODO: This is super janky. Ideally we want to have a firestore listener to keep our react state in sync or have setUser update both
 * react state and firestore. Still deciding the best way to go and don't want to be blocked by this for now.
 * @param user
 * @param setUser
 */
export async function updateUserMetadata(
  metadata: UserMetadataUpdate,
  currContext: CurrentUserContextType,
): Promise<void> {
  let { user, setUser } = currContext;

  // Update user object with new metadata
  user = {
    ...user,
    metadata: {
      ...user.metadata,
      ...metadata,
    },
  };

  // await metadata in firestore
  await firestore()
    .collection(collectionName)
    .doc(user.user.uid)
    .update(metadata);

  // Notify React context with updated user object
  setUser(user);
}

export async function updateUserInfo(
  updateInfo: FirebaseAuthTypes.UpdateProfile,
  currContext: CurrentUserContextType,
): Promise<void> {
  // Update Firebase
  const user = auth().currentUser;
  if (!user) {
    throw new Error(
      "udpate user info can only be used during a logged in session",
    );
  }

  await user.updateProfile(updateInfo);
  // Notify React context of updated user object
  const updatedUser: User = {
    ...currContext.user,
    user: {
      ...currContext.user.user,
      ...(updateInfo as FirebaseAuthTypes.UserInfo),
    },
  };
  console.debug(`updated user: ${JSON.stringify(updatedUser)}`);
  currContext.setUser(updatedUser);
}
