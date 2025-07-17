import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === 'android' ? '#6A5ACD' : 'transparent'}
        translucent={Platform.OS === 'android'}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }} edges={['top']}>
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
