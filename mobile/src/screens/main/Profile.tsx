import React, { useContext } from "react";
import { View, Text, Image } from "react-native";
import { Button, TextInput } from "@/components";
import tw from "@/lib/tailwind";
import { CurrentUserContext, CurrentUserContextType } from "@/context";
import auth from "@react-native-firebase/auth";
import { updateUserMetadata } from "@/db/user";
import { OnboardingStage } from "@/types/user";
import { updateUserInfo } from "@/db/user";
const signOutUserSync = (): void => {
  async function signOutUser(): Promise<void> {
    await auth().signOut();
  }
  signOutUser().catch((e) => {
    console.error(e);
  });
};

const resetOnboarding = (currUserContext: CurrentUserContextType): void => {
  async function inner(): Promise<void> {
    await updateUserMetadata(
      { onboardingStage: OnboardingStage.Welcome },
      currUserContext,
    );
  }
  inner().catch((e) => {
    console.error(e);
  });
};

export default function Profile(): React.JSX.Element {
  const { user, setUser } = useContext(CurrentUserContext);
  const [newName, setNewName] = React.useState("");

  return (
    <View
      style={tw`flex-1 flex-col bg-gray-300 items-center gap-5 justify-between`}
    >
      <Image
        source={{ uri: user.user.photoURL }}
        style={tw`rounded-full aspect-square w-2/6 m-5`}
      />

      <View style={tw`flex-2 bg-white rounded-3xl w-4/5`}>
        <View
          style={tw`bg-neutral-500 relative -top-4 w-1/4 py-2 px-5 rounded-3xl self-center`}
        >
          <Text style={tw`text-white  text-center`}>Profile</Text>
        </View>
        <Text style={tw`text-gray-500 text-center font-extrabold`}>
          {user.user.displayName}
        </Text>
        <View style={tw`m-4 gap-3`}>
          <TextInput
            placeholder="New Name"
            value={newName}
            onChangeText={(text) => {
              setNewName(text);
            }}
          />
          <Button
            onPress={() => {
              updateUserInfo({ displayName: newName }, { user, setUser }).catch(
                (e) => console.error(e),
              );
            }}
            text="Update Display Name"
          />
        </View>
      </View>

      <View style={tw`flex-1 flex-row items-center gap-5`}>
        <Button
          onPress={signOutUserSync}
          text="Sign Out"
          style={tw`rounded-3xl`}
        />
        <Button
          onPress={() => {
            if (user === null) {
              return;
            }
            resetOnboarding({ user, setUser });
          }}
          text="Restart Onboarding"
          style={tw`rounded-3xl`}
        />
      </View>
    </View>
  );
}
