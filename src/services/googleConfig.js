
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '204813832132-gov8tj7qp66aj5m8oj1ss7sgpigt9rm2.apps.googleusercontent.com',  
    offlineAccess: true,
  });
};

export const handleGoogleLogin = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const signInResult = await GoogleSignin.signIn();
  const idToken = signInResult.data.idToken;
  const user = signInResult.data.user;

  if (!idToken) throw new Error('No ID token received from Google Sign-In');
  const googleCredential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(getAuth(), googleCredential);

  await AsyncStorage.setItem('googleUser', JSON.stringify(user));

  return user;

};