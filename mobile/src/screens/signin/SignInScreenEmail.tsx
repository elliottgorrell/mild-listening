import React from "react";
import { View, SafeAreaView, Pressable, Text } from "react-native";
import { Button, TextInput } from "@/components";
import type { StackScreenProps } from "@react-navigation/stack";
import type { AuthStackParamList } from "@/navigation/authStack";
import tw from "@/lib/tailwind";
import auth from "@react-native-firebase/auth";

const SignInScreenEmail: React.FC<
  StackScreenProps<AuthStackParamList, "SignInEmail">
> = ({ navigation }): React.JSX.Element => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  function SignIn(): void {
    async function SignInPromise(): Promise<void> {
      if (value.email === "" || value.password === "") {
        setValue({
          ...value,
          error: "Email and password are mandatory.",
        });
        return;
      }

      await auth().signInWithEmailAndPassword(value.email, value.password);
    }
    SignInPromise().catch((err) => {
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
        <Text style={tw`text-3xl font-extrabold self-center`}>Login</Text>
        <Text style={tw`text-sm  font-extrabold text-gray-500 self-center`}>
          Please sign in to continue
        </Text>
        {!(value.error === "") && (
          <Text
            style={tw`bg-red-100 border border-red-400 text-red-700 px-4 py-3`}
          >
            {value.error}
          </Text>
        )}
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
        <Button onPress={SignIn}>Sign In</Button>
      </View>

      <View style={tw`flex-1 justify-end self-center`}>
        <Pressable
          style={tw`flex-row gap-2`}
          onPress={() => {
            navigation.navigate("Welcome");
          }}
        >
          <Text>{"Don't have an account?"}</Text>
          <Text style={tw`font-bold`}>Sign Up here</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreenEmail;
