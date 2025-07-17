import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import MainLayout from '../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');
const boxSize = width / 2.6;

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <MainLayout title="Dashboard">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('BookingScreen')}>
            <MaterialIcons name="record-voice-over" size={26} color="#7442FF" />
            <Text style={styles.boxTitle}>Book a Talk</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('ShareStory')}>
            <FontAwesome5 name="book-open" size={24} color="#7442FF" />
            <Text style={styles.boxTitle}>Share Your Story</Text>
          </TouchableOpacity>

         

          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Collaboration')}>
            <FontAwesome5 name="handshake" size={24} color="#7442FF" />
            <Text style={styles.boxTitle}>Collaborations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('MyBookings')}>
            <AntDesign name="calendar" size={26} color="#7442FF" />
            <Text style={styles.boxTitle}>My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Profile')}>
            <AntDesign name="user" size={26} color="#7442FF" />
            <Text style={styles.boxTitle}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Help')}>
            <AntDesign name="infocirlceo" size={26} color="#7442FF" />
            <Text style={styles.boxTitle}>Help & Info</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  box: {
    width: boxSize,
    height: boxSize,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  boxTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default DashboardScreen;
