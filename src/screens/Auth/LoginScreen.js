import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import styles from '../../styles/Auth/LoginScreen.styles';
import CustomHeader from '../../components/CustomHeader';
import CustomAlertModal from '../../components/CustomAlertModal';
import { loginUser, checkEmailExists, getUserByEmail, CheckIfLoginFromGoogle } from '../../api/loginApi';
import { registerUser } from '../../api/userApi';
import { configureGoogleSignIn, handleGoogleLogin } from '../../services/googleConfig';
import { BASE_API_URL } from '../../api/apiConfig';
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    onConfirm: null,
  });

  const [googleUserData, setGoogleUserData] = useState(null);
  const [googlePhone, setGooglePhone] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleConfirmPassword, setGoogleConfirmPassword] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const showModal = (title, message, onConfirm) => {
    setModalContent({
      title,
      message,
      onConfirm: () => {
        setModalVisible(false);
        if (onConfirm) onConfirm();
      },
    });
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      return showModal('Validation Error', 'Please enter both username and password.');
    }

    setLoading(true);
    try {
      const payload = { loginName: username, password };
      const response = await loginUser(payload);

      if (response?.status === 200 && response?.data?.isLoginSuccess && response?.data?.token) {
        const { token, fName, lName, email, userId, mobile } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('customerFullName', `${fName} ${lName}`);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('phone', String(mobile));
        try {
          const imgRes = await axios.get(`${BASE_API_URL}/api/Services/GetUserById?uniqueId=${userId}`);
          debugger;
          if (imgRes.status === 200 && imgRes.data?.profileImageUrl) {
            await AsyncStorage.setItem('profileImageUrl', imgRes.data.profileImageUrl);
          }
        } catch (imgErr) {
          console.warn('Could not fetch profile image', imgErr);
        }
        showModal('✅ Success', 'You are now logged in!', () => navigation.replace('Dashboard'));
      } else {
        showModal('Login Failed', 'Incorrect username or password. Please try again.');
      }
    } catch (error) {
      const message = error?.response?.data?.errorMessages || 'Server error. Please try again.';
      showModal('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await handleGoogleLogin();
      const emailExists = await CheckIfLoginFromGoogle(user.email);
      debugger;
      if (emailExists?.exists) {
        try {
          const loginRes = await loginUser({
            loginName: user.email,
            password: "12345678",
            isGoogleSignIn: true,
          });

          if (loginRes?.status === 200 && loginRes?.data?.isLoginSuccess && loginRes?.data?.token) {
            const { token, fName, lName, email, userId, mobile } = loginRes.data;

            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("userId", userId.toString());
            await AsyncStorage.setItem("customerFullName", `${fName} ${lName}`);
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("phone", String(mobile));

            if (user.photoUrl) {
              await AsyncStorage.setItem("profileImageUrl", user.photoUrl);
            }

            return showModal("✅ Success", "You are now logged in with Google!", () =>
              navigation.replace("Dashboard")
            );
          } else {
            return showModal("Login Failed", "Unable to log in with Google. Please try again.");
          }
        } catch (err) {
          console.error("Google auto-login error:", err);
          return showModal("Login Error", "Something went wrong while logging in.");
        }
      } else {
        setGoogleUserData(user);
        setShowGoogleModal(true);
      }
    } catch (error) {
      console.error(error);
      showModal("Google Sign-In Error", "Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleRegistration = async () => {
    setLoading(true);
    if (!googlePhone || !googlePassword || !googleConfirmPassword) {
      return showModal('Validation Error', 'All fields are required');
    }

    if (googlePassword !== googleConfirmPassword) {
      return showModal('Error', 'Passwords do not match');
    }

    const payload = {
      firstName: googleUserData?.givenName || '',
      lastName: googleUserData?.familyName || '',
      phoneNumber: googlePhone,
      email: googleUserData?.email,
      password: googlePassword,
      confirmPassword: googleConfirmPassword,
      roles: ['Customer'],
      googleSignIn: true,
    };

    try {
      const regRes = await registerUser(payload);
      const data = regRes?.data;
      if (data.isCreated === true) {
        const loginRes = await loginUser({
          loginName: googlePhone,
          password: googlePassword,
          isGoogleSignIn: true,
        });
        debugger;
        if (
          loginRes.status === 200 &&
          loginRes.data?.isLoginSuccess &&
          loginRes.data?.token
        ) {
          const user = loginRes.data;
          await AsyncStorage.setItem('token', user.token);
          await AsyncStorage.setItem('userId', user.userId.toString());
          await AsyncStorage.setItem('customerFullName', `${user.fName} ${user.lName}`);
          await AsyncStorage.setItem('email', user.email);
          await AsyncStorage.setItem('phone', googlePhone);

          setShowGoogleModal(false);
          showModal('✅ Success', 'You are now logged in With Google!', () =>
            navigation.replace('Dashboard')
          );
        } else {
          showModal('Login Failed', loginRes?.data?.errorMessages || 'Login failed after registration');
        }
      } else {
        showModal('Registration Failed', regRes?.data?.errorMessage || 'Unexpected registration error');
      }
    } catch (err) {

      showModal('Error', apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={t('loginTitle')} hideMenu />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t('loginUsernamePlaceholder')}
              placeholderTextColor="#999"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder={t('loginPasswordPlaceholder')}
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
              </TouchableOpacity>
            </View>

          </View>

          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ForgotPassword')} >
            <Text style={styles.forgotPasswordText}> {t('forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}> {t('loginButton')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={customStyles.googleSignInButton} onPress={handleGoogleSignIn}>
            <Image source={require('../../assets/google_logo.png')} style={customStyles.googleLogo} />
            <Text style={customStyles.googleSignInText}>{t('googleSignIn')}</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}> {t('noAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.registerLink}>  {t('register')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Loading Spinner */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={customStyles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={customStyles.text}> {t('loggingIn')}</Text>
        </View>
      </Modal>

      {/* Google Registration Modal */}
      <Modal visible={showGoogleModal} transparent animationType="slide">
        <View style={customStyles.overlay}>
          <View style={styles.googleModalBox}>
            <Text style={styles.googleModalTitle}>👋 Welcome {googleUserData?.givenName}!</Text>
            <Text style={styles.googleModalSubText}>Please complete your profile</Text>

            <TextInput
              placeholder="📞 Phone Number"
              keyboardType="phone-pad"
              style={styles.googleInput}
              value={googlePhone}
              onChangeText={setGooglePhone}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="🔒 Password"
              secureTextEntry
              style={styles.googleInput}
              value={googlePassword}
              onChangeText={setGooglePassword}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="🔒 Confirm Password"
              secureTextEntry
              style={styles.googleInput}
              value={googleConfirmPassword}
              onChangeText={setGoogleConfirmPassword}
              placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.googleSubmitButton} onPress={handleGoogleRegistration}>
              <Text style={styles.googleSubmitText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowGoogleModal(false)}>
              <Text style={styles.googleCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      <CustomAlertModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={() => setModalVisible(false)}
        onConfirm={modalContent.onConfirm}
      />
    </SafeAreaView>
  );
};

const customStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleSignInText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
});

export default LoginScreen;