import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig';

export const registerUser = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/UserAccount/UserRegistration`, payload, {
      headers: { 
        'Content-Type': 'application/json',
       },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  const email = await AsyncStorage.getItem('email');  

  const url = `${BASE_URL}/api/UserAccount/ChangePasswordbyEmail?email=${encodeURIComponent(email)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`;

  const response = await axios.post(url);
  return response.data;
  
};