import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomAlertModal from '../components/CustomAlertModal';
import MainLayout from '../components/MainLayout';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const UpdateProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uniqueId, setUniqueId] = useState(null);

  const [initialDob, setInitialDob] = useState(null);
  const [initialGender, setInitialGender] = useState('');
  const [initialImageUri, setInitialImageUri] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const API_BASE_URL = 'http://appointment.bitprosofttech.com/api';
  const UPDATE_USER_API = `${API_BASE_URL}/UserAccount/UpdateProfile`;
  const IMAGE_BASE_URL = 'http://appointment.bitprosofttech.com';

  const showModal = (title, message) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  useEffect(() => {
    const loadData = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUniqueId(id);
        fetchUserDetails(id);
      } else {
        showModal('Error', 'User ID not found.');
        setFetchLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Services/GetUserById?uniqueId=${userId}`);
      const user = await response.json();

      if (response.ok && user) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.loginEmail);
        setPhoneNumber(user.phoneNumber);
        setDob(new Date(user.dateOfBirth));
        setInitialDob(new Date(user.dateOfBirth));
        setGender(user.gender);
        setInitialGender(user.gender);

        if (user.profileImageUrl) {
          const imageUri = `${IMAGE_BASE_URL}${user.profileImageUrl}`;
          setProfileImage({ uri: imageUri });
          setInitialImageUri(imageUri);
        }
      } else {
        showModal('Error', 'Failed to fetch user data.');
      }
    } catch (error) {
      showModal('Error', 'Network error. Could not fetch profile data.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0]);
    }
  };

  const handleDateConfirm = (date) => {
    setDob(date);
    setDatePickerVisibility(false);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !dob || !gender) {
      showModal('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('UserId', uniqueId);
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('PhoneNumber', phoneNumber);
    formData.append('DateOfBirth', dob.toISOString());
    formData.append('Address', 'UAE'); // Hardcoded default address
    formData.append('Gender', gender);

    if (profileImage && profileImage.uri && profileImage.uri !== initialImageUri) {
      formData.append('ProfileImage', {
        uri: profileImage.uri,
        name: profileImage.fileName || 'profile.jpg',
        type: profileImage.type || 'image/jpeg',
      });
    }

    try {
      const response = await fetch(UPDATE_USER_API, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showModal('Update Failed', errorData?.errorMessages?.[0] || 'Something went wrong.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data?.isUpdated) {
        await AsyncStorage.setItem('customerFullName', `${firstName} ${lastName}`);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('phone', String(phoneNumber));
        await AsyncStorage.setItem('address', 'UAE');

        showModal('✅ Success', 'Your profile has been updated.');
        fetchUserDetails(uniqueId);
      } else {
        showModal('Update Failed', data?.errorMessages?.[0] || 'Something went wrong.');
      }
    } catch (err) {
      showModal('Error', 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <MainLayout title="Update Profile">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A1B9A" />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Update Profile">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
              {profileImage ? (
                <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="person-circle-outline" size={80} color="#6A1B9A" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImagePick} style={styles.cameraButton}>
              <Icon name="camera-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
                <Text style={dob ? styles.dateText : styles.placeholderText}>
                  {dob ? dob.toDateString() : 'Select DOB'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
                maximumDate={new Date()}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Gender</Text>
              {showGenderDropdown ? (
                <View style={styles.dropdownContainer}>
                  {['Male', 'Female', 'Other'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setGender(option);
                        setShowGenderDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.genderDisplay}
                  onPress={() => setShowGenderDropdown(true)}
                >
                  <Text style={styles.genderDisplayText}>
                    {gender ? gender : 'Select Gender'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlertModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={() => setModalVisible(false)}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  profileImage: { width: '100%', height: '100%' },
  imagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#0D5EA6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 8 },
  column: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  placeholderText: { color: '#999' },
  dateText: { color: '#333' },
  genderDisplay: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  genderDisplayText: { fontSize: 16, color: '#333' },
  dropdownContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fff' },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 16, color: '#333' },
  button: {
    backgroundColor: '#0D5EA6',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: { backgroundColor: '#BCAAA4' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default UpdateProfileScreen;
