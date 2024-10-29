import {
  LoginManager,
  AccessToken,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { sha256 } from 'react-native-sha256';

/**
 * Signs in to Firebase using Facebook's classic login.
 * @returns The user credential.
 */
export async function facebookClassicLogin(): Promise<FirebaseAuthTypes.UserCredential> {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  if (result.isCancelled) {
    throw new Error('User cancelled the login process');
  }

  // Once signed in, get the users AccessToken
  const data = await AccessToken.getCurrentAccessToken();

  if (data === null) {
    throw new Error('Something went wrong obtaining access token');
  }
  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken
  );
  console.debug(`access_token: ${data.accessToken}`);

  // Sign-in the user with the credential
  const firebaseUserCredential =
    await auth().signInWithCredential(facebookCredential);
  const firebaseJwt = await firebaseUserCredential.user.getIdToken();
  console.log(`firebaseUserCredential: ${firebaseJwt}`);
  return firebaseUserCredential;
}

/**
 * Signs in to Firebase using Facebook's limited login.
 *
 * Please note that limited login is only available on iOS devices.
 * @returns The user credential.
 */
export async function facebookLimitedLoginiOS(): Promise<FirebaseAuthTypes.UserCredential> {
  // Create a nonce
  const nonce = Date.now().toString();
  const nonceSha256 = await sha256(nonce);

  // Attempt login with permissions and limited login
  const result = await LoginManager.logInWithPermissions(
    ['public_profile', 'email'],
    'limited',
    nonceSha256
  );

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AuthenticationToken
  const data = await AuthenticationToken.getAuthenticationTokenIOS();

  if (!data) {
    throw 'Something went wrong obtaining authentication token';
  }
  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.authenticationToken,
    nonce
  );
  console.debug(`auth_token: ${data.authenticationToken}`);

  // Sign-in the user with the credential
  const firebaseUserCredential =
    await auth().signInWithCredential(facebookCredential);
  const firebaseJwt = await firebaseUserCredential.user.getIdToken();
  console.log(`firebaseUserCredential: ${firebaseJwt}`);
  return firebaseUserCredential;
}
