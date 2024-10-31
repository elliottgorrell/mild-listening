/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { WelcomeScreen } from '@/screens/signin';

export type AuthStackParamList = {
  Welcome: undefined;
  SignUpEmail: undefined;
  SignInEmail: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false, animationEnabled: false }}
          component={WelcomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
