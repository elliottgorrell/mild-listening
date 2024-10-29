import React from "react";
import { View, SafeAreaView, Pressable, Text } from "react-native";
import tw from "@/lib/tailwind";
import { Button, TextInput } from "@/components";
import type { StackScreenProps } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";

import type { AuthStackParamList } from "@/navigation/authStack";

const SignUpScreen: React.FC<
  StackScreenProps<AuthStackParamList, "SignUpEmail">
> = ({ navigation }) => {
  const [value, setValue] = React.useState({
    name: "",
    email: "",
    password: "",
    error: "",
  });

  function signUp(): void {
    async function signUpPromise(): Promise<void> {
      if (value.email === "" || value.password === "" || value.name === "") {
        setValue({
          ...value,
          error: "All fields are mandatory.",
        });
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        value.email,
        value.password,
      );
      await userCredential.user.updateProfile({
        displayName: value.name,
      });
    }
    signUpPromise().catch((err) => {
      const error = err instanceof Error ? err.message : "Unexpected error";
      setValue({
        ...value,
        error,
      });
    });
  }

  return (
    <SafeAreaView style={tw`w-4/5 flex-1 self-center`}>
      <View style={tw`flex-2 justify-end gap-3`}>
        <Text style={tw`text-3xl font-extrabold self-center`}>Sign Up</Text>
        <Text style={tw`text-sm  font-extrabold text-gray-500 self-center`}>
          Please sign up to continue
        </Text>

        {!(value.error === "") && (
          <Text
            style={tw`bg-red-100 border border-red-400 text-red-700 px-4 py-3`}
          >
            {value.error}
          </Text>
        )}

        <TextInput
          placeholder="Name"
          value={value.name}
          onChangeText={(text) => {
            setValue({ ...value, name: text });
          }}
        />

        <TextInput
          placeholder="Email"
          value={value.email}
          onChangeText={(text) => {
            setValue({ ...value, email: text });
          }}
        />

        <TextInput
          placeholder="Password"
          value={value.password}
          onChangeText={(text) => {
            setValue({ ...value, password: text });
          }}
          secureTextEntry={true}
        />

        <Button onPress={signUp}>Sign Up</Button>
      </View>

      <View style={tw`flex-1 justify-end self-center`}>
        <Pressable
          style={tw`flex-row gap-2`}
          onPress={() => {
            navigation.navigate("SignInEmail");
          }}
        >
          <Text> Existing member?</Text>
          <Text style={tw`font-bold`}>Log in here</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
