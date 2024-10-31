import React, { useContext } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList } from '@/navigation/authStack';
import tw from '@/lib/tailwind';
import { SpotifyLoginButton } from '@/components/SpotifyButton';
import { CurrentUserContext } from '@/context';

const spotifyConfig = {
  clientId: '01e481bb514444be82c79d8cdc6a2174',
  scopes: ['user-read-email'],
};

const WelcomeScreen: React.FC<
  StackScreenProps<AuthStackParamList, 'Welcome'>
> = ({ navigation }) => {
  const { setUser } = useContext(CurrentUserContext);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Text style={tw`text-3xl font-extrabold self-center`}>
          Get Started...
        </Text>

        <SpotifyLoginButton
          text="SPOTIFY"
          style={styles.button}
          icon={{ name: 'spotify', type: 'FontAwesome5' }}
          clientId={spotifyConfig.clientId}
          scopes={spotifyConfig.scopes}
          onLoginSuccess={(spotifyApi, user) => {
            console.log(`Signed in with Spotify for ${user.display_name}!`);
            console.log(JSON.stringify(user));
            setUser({ user: user });
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
