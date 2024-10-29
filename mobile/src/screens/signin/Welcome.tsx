import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { Button } from '@/components/button';
import type { AuthStackParamList } from '@/navigation/authStack';
import { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { facebookClassicLogin, facebookLimitedLoginiOS } from '@/lib/facebook';
import tw from '@/lib/tailwind';
import { googleLogin } from '@/lib/google';

const WelcomeScreen: React.FC<
  StackScreenProps<AuthStackParamList, 'Welcome'>
> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Text style={tw`text-3xl font-extrabold self-center`}>
          Get Started...
        </Text>
        <Button
          text="EMAIL"
          style={styles.button}
          icon={{
            name: 'envelope',
            type: 'FontAwesome5',
          }}
          onPress={() => {
            navigation.navigate('SignUpEmail');
          }}
        />
        <Button
          text="FACEBOOK"
          style={styles.button}
          icon={{
            name: 'facebook',
            type: 'FontAwesome5',
          }}
          onPress={() => {
            onFacebookButtonPress()
              .then((userCredential) => {
                console.log(
                  `Signed in with Facebook for ${userCredential.user.displayName}!`
                );
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        />
        <Button
          text="GOOGLE"
          style={styles.button}
          icon={{
            name: 'google',
            type: 'FontAwesome5',
          }}
          onPress={() => {
            googleLogin()
              .then((userCredential) => {
                console.log(
                  `Signed in with Google for ${userCredential.user.displayName}!`
                );
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        />
      </View>

      <View>
        <Pressable
          style={styles.loginContainer}
          onPress={() => {
            navigation.navigate('SignInEmail');
          }}
        >
          <Text style={styles.textLogin}> Existing member?</Text>
          <Text style={styles.buttonLogin}>Log in here</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

async function onFacebookButtonPress(): Promise<FirebaseAuthTypes.UserCredential> {
  // If on android we use classic login and if on iOS we have to use limited login due to apple rules
  if (Platform.OS === 'ios') {
    return await facebookLimitedLoginiOS();
  }
  return await facebookClassicLogin();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  button: {
    marginTop: 20,
  },

  text: {
    marginBottom: 20,
    alignSelf: 'center',
  },

  buttonsContainer: {
    width: '80%',
    justifyContent: 'center',
    flexGrow: 2,
  },

  textLogin: {
    alignSelf: 'center',
  },

  loginContainer: {
    flexDirection: 'row',
  },

  buttonLogin: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default WelcomeScreen;
