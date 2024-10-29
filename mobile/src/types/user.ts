import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface User {
  user: FirebaseAuthTypes.UserInfo;
  metadata: UserMetadata;
}

export interface UserMetadata {
  uid: string;
  onboardingStage: OnboardingStage;
}

export enum OnboardingStage {
  Welcome = 0,
  Finished = 100,
}

export const LoggedOutUser: User = {
  user: {
    uid: "0",
    providerId: "0",
  },
  metadata: {
    uid: "0",
    onboardingStage: OnboardingStage.Welcome,
  },
};
