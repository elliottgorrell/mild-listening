import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';

export async function googleLogin(): Promise<FirebaseAuthTypes.UserCredential> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_ID;
  if (!webClientId) {
    throw new Error(
      'EXPO_PUBLIC_GOOGLE_WEB_ID must be set for google login to work. This can be done in mobile/.env'
    );
  }
  console.log(webClientId);
  await GoogleSignin.configure({
    webClientId: webClientId,
  });
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const response = await GoogleSignin.signIn();

  if (isSuccessResponse(response)) {
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      response.data.idToken
    );

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  } else {
    throw new Error('User cancelled google signin');
  }
}
