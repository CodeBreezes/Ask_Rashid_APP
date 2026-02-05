import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from '../../api/userApi';
import { loginUser } from '../../api/loginApi';
import CustomAlertModal from '../../components/CustomAlertModal';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [profileImageUri, setProfileImageUri] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    confirmText: 'OK',
    onConfirm: () => setModalVisible(false),
  });

  // Placeholder function since `react-native-image-picker` is removed.
  const handleImageUpload = () => {
    Alert.alert(
      "Feature Unavailable",
      "Image uploading requires an external library. Functionality has been preserved, but it is commented out to adhere to the request."
    );
   
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  const showModal = (title, message, confirmText = 'OK', onConfirm = () => setModalVisible(false)) => {
    setModalContent({ title, message, confirmText, onConfirm });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      return showModal('Validation Error', 'All fields are required.');
    }

    if (!isValidPhone(phoneNumber)) {
      return showModal('Validation Error', 'Phone number must be 10 digits.');
    }

    if (!isValidEmail(email)) {
      return showModal('Validation Error', 'Please enter a valid email address.');
    }

    if (password.length < 6) {
      return showModal('Validation Error', 'Password must be at least 6 characters.');
    }

    if (password !== confirmPassword) {
      return showModal('Validation Error', 'Passwords do not match.');
    }

    setLoading(true);

    const payload = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
      roles: ['Customer'],
      errorMessage: '',
      successMessage: '',
      notificationMessage: '',
    };

    try {
      const response = await registerUser(payload);
      debugger;
      if (response.status === 200 || response.status === 201) {
        const resData = response.data;

        if (resData.isCreated === false && resData.errorMessages?.length > 0) {
          return showModal('⚠️ Registration Failed', resData.errorMessages[0]);
        }
        const loginPayload = { loginName: phoneNumber, password };
        const loginResponse = await loginUser(loginPayload);

        if (
          loginResponse.status === 200 &&
          loginResponse.data?.isLoginSuccess &&
          loginResponse.data?.token
        ) {
          
          showModal(
            '✅ Success',
            'Your Form has been Submitted successfully',
            'OK',
            () => {
              setModalVisible(false);
              navigation.replace('Login');
            }
          );
        } else {
          showModal('⚠️ Login Failed', loginResponse?.data?.errorMessages || 'Could not log in after signup.');
        }
      } else {
        showModal('⚠️ Registration Failed', response?.data?.errorMessage || 'Unexpected error.');
      }
    } catch (error) {
      const message = error?.response?.data?.errorMessage || 'Server error. Please try again.';
      showModal('❌ Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardContainer}>

            <Text style={styles.profileTitle}>{t("createProfileTitle")}</Text>
            <Text style={styles.profileSubtitle}>{t("createProfileSubtitle")}</Text>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder={t("firstName")}
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder={t("lastName")}
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder={t("phoneNumber")}
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder={t("email")}
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder={t("password")}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder={t("confirmPassword")}
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>{t("signUp")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlertModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        onClose={() => setModalVisible(false)}
        onConfirm={modalContent.onConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4285f4',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    color: '#4285f4',
    fontSize: 50,
    fontWeight: '200',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 5,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  signUpButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#4285f4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#4285f4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;