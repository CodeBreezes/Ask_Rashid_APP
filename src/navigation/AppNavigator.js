import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogoutScreen from '../screens/LogoutScreen';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ProfileScreen from '../screens/Auth/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import AuthLoadingScreen from '../screens/Auth/AuthLoadingScreen'; 
import PaymentScreen from '../screens/PaymentScreen';
import HelpInfoScreen from '../screens/HelpInfoScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import AboutScreen from '../screens/AboutScreen'; 
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen'
import UpdateProfileScreen from '../screens/UpdateProfileScreen'
import ContactUsScreen from '../screens/ContactUsScreen'  

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Logout" component={LogoutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HelpInfoScreen" component={HelpInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ headerShown: false }} /> 
         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
