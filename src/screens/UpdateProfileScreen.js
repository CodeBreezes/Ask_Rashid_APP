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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { showModal } from '../components/CustomAlertModal';
import MainLayout from '../components/MainLayout';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const UpdateProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(null);
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uniqueId, setUniqueId] = useState(null);

  // API Endpoints
  const API_BASE_URL = 'http://appointment.bitprosofttech.com/api';
  const UPDATE_USER_API = `${API_BASE_URL}/UserAccount/UpdateProfile`;
  const IMAGE_BASE_URL = 'http://appointment.bitprosofttech.com';

  useEffect(() => {
    // Call the function to get the user ID and then fetch details
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
        setDob(new Date(user.dateOfBirth));
        setAddress(user.address);
        setGender(user.gender);
        if (user.profileImageUrl) {
          setProfileImage({ uri: `${IMAGE_BASE_URL}${user.profileImageUrl}` });
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
    if (!firstName || !lastName || !email || !dob || !gender) {
      showModal('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('UserId', uniqueId);
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('DateOfBirth', dob.toISOString());
    formData.append('Address', address);
    formData.append('Gender', gender);

    if (profileImage && profileImage.uri && !profileImage.uri.startsWith(IMAGE_BASE_URL)) {
      formData.append('ProfileImage', {
        uri: profileImage.uri,
        name: profileImage.fileName || 'profile.jpg',
        type: profileImage.type || 'image/jpeg',
      });
    }

    try {
      const response = await fetch(UPDATE_USER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
debugger;

      if (data?.isUpdated) {
        showModal('✅ Success', 'Your profile has been updated.');
        // Re-fetch user details to display the updated data
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
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
              <View style={styles.pickerContainer}>
                <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                  <Picker.Item label="Gender" value="" color="#999" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter Address"
            placeholderTextColor="#999"
            multiline
          />

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
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 8,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  placeholderText: {
    color: '#999',
  },
  dateText: {
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        paddingVertical: 4,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  button: {
    backgroundColor: '#0D5EA6',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#BCAAA4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateProfileScreen;