import React, { useContext } from "react";
import MainStack from "./mainStack";
import AuthStack from "./authStack";
import OnboardingStack from "./onboardingStack";
import { LoggedOutUser, OnboardingStage } from "@/types/user";
import { CurrentUserContext } from "@/context";

export default function RootNavigation(): React.JSX.Element {
  const { user } = useContext(CurrentUserContext);

  if (user === LoggedOutUser) {
    return <AuthStack />;
  }

  if (user.metadata.onboardingStage !== OnboardingStage.Finished) {
    return <OnboardingStack />;
  }

  return <MainStack />;
}
