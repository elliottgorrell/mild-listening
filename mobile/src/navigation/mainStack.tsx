import React from 'react';
import { Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Profile } from '@/screens/main';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '@/lib/tailwind';
import { Icon } from '@/components';
const Stack = createStackNavigator();

export default function MainStack(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate('Profile')}
                style={tw`pr-5`}
              >
                <Icon
                  type="Ionicons"
                  name="person"
                  size={32}
                  color={tw.color('neutral-500')}
                />
              </Pressable>
            ),
            headerTitle: 'Mild Listening',
          })}
        />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
