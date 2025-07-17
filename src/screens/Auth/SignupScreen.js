import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MainLayout from '../../components/MainLayout';
import { registerCustomer } from '../../api/customerApi';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      Alert.alert('Validation Error', 'Please fill out all fields');
      return;
    }

    const payload = {
      firstName,
      lastName,
      phoneNumber,
      email,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    };

    try {
      const response = await registerCustomer(payload);
      if (response.status === 201 || response.status === 200) {
        const customer = response.data;
        await AsyncStorage.setItem('customerUniqueId', customer.uniqueId.toString());
        await AsyncStorage.setItem('customerFullName', customer.fullName);
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to register. Please try again.');
    }
  };

  return (
    <MainLayout title="Signup">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
          />
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
