/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { WelcomeScreen, CompletionScreen } from "@/screens/onboarding";

export type OnboardingStackParamList = {
  Welcome: undefined;
  Completion: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false, animationEnabled: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Completion"
          options={{ headerShown: false, animationEnabled: false }}
          component={CompletionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
