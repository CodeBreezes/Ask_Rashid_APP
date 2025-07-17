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
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from '../../styles/Auth/ProfileScreen.styles';
import { registerUser } from '../../api/userApi';
import { loginUser } from '../../api/loginApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CustomAlertModal from '../../components/CustomAlertModal';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [profileImageUri, setProfileImageUri] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastLame, setLastLame] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    confirmText: 'OK',
    onConfirm: () => setModalVisible(false),
  });

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImageUri(response.assets[0].uri);
      }
    });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  const showModal = (title, message, confirmText = 'OK', onConfirm = () => setModalVisible(false)) => {
    setModalContent({ title, message, confirmText, onConfirm });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastLame || !phoneNumber || !email || !password || !confirmPassword) {
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

    const payload = {
      firstName,
      lastLame,
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

      if (response.status === 200 || response.status === 201) {
        const loginPayload = { loginName: phoneNumber, password };
        const loginResponse = await loginUser(loginPayload);

        if (
          loginResponse.status === 200 &&
          loginResponse.data?.isLoginSuccess &&
          loginResponse.data?.token
        ) {
          const user = loginResponse.data;

          await AsyncStorage.setItem('token', user.token);
          await AsyncStorage.setItem('userId', user.userId.toString());
          await AsyncStorage.setItem('customerFullName', `${user.fName} ${user.lName}`);
          await AsyncStorage.setItem('email', user.email);

          showModal(
            '🎉 Registration Successful',
            'You are now logged in!',
            'Go to Dashboard',
            () => {
              setModalVisible(false);
              navigation.replace('Dashboard');
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
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6A5ACD" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={handleImageUpload}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
            ) : (
              <AntDesign name="user" size={60} color="white" />
            )}
          </TouchableOpacity>
          <Text style={styles.profilePictureText}>Profile Picture</Text>
          <Text style={styles.uploadImageText}>Upload a personal image</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={lastLame}
            onChangeText={setLastLame}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
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

export default ProfileScreen;
