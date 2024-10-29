import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Home, Secondary, Profile } from "@/screens/main";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "@/lib/tailwind";
import { Icon } from "@/components";
import { Ionicons } from "@expo/vector-icons";
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

type tabIconsType = {
  [key: string]: keyof typeof Ionicons.glyphMap;
};

const tabIcons: tabIconsType = {
  Home: "albums-outline",
  Secondary: "chatbubble",
  Profile: "person",
};

export default function MainStack(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tab"
          options={{ headerShown: false, animationEnabled: false }}
        >
          {() => (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarInactiveTintColor: tw.color("neutral-200"),
                tabBarActiveTintColor: tw.color("neutral-500"),
                tabBarIndicatorStyle: {
                  backgroundColor: "transparent",
                },
                tabBarStyle: {
                  backgroundColor: tw.color("white"),
                  paddingTop: insets.top,
                  paddingLeft: insets.left,
                  paddingRight: insets.right,
                },
                tabBarIconStyle: {
                  minHeight: 40,
                  minWidth: 40,
                },
                tabBarIcon: ({ focused, color }) => {
                  let iconName = tabIcons[route.name as keyof typeof tabIcons];
                  return (
                    <Icon
                      type="Ionicons"
                      name={iconName}
                      size={32}
                      color={color}
                    />
                  );
                },
                tabBarShowLabel: false,
              })}
            >
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name={"Secondary"} component={Secondary} />
              <Tab.Screen name={"Profile"} component={Profile} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
