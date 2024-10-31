import React from 'react';
import { StyleSheet, SafeAreaView, View, Pressable, Text } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList } from '@/navigation/authStack';
import tw from '@/lib/tailwind';
import { SpotifyLoginButton } from '@/components/SpotifyButton';
import { useCurrentUserContext } from '@/context';

const WelcomeScreen: React.FC<
  StackScreenProps<AuthStackParamList, 'Welcome'>
> = ({ navigation }) => {
  const { setUser } = useCurrentUserContext();
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
          onLoginSuccess={(spotifyApi, user) => {
            console.log(
              `Signed in with Spotify for ${user.user.display_name}!`
            );
            setUser(user);
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
