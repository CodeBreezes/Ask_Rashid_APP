import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Texts from "../components/Texts";

const LogoutScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.clear();
      setTimeout(() => {
        navigation.replace('Login');
      }, 1500);  
    };
    logout();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
      />
      <Texts style={styles.text}>Logging you out...</Texts>
      <ActivityIndicator size="large" color="#6A5ACD" style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});

export default LogoutScreen;
