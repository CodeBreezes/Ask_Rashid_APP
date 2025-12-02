import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URL } from '../api/apiConfig';


const { width, height } = Dimensions.get('window');


const MainLayout = ({ title, children }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fullName, setFullName] = useState('Guest');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('customerFullName');
        const phoneNumber = await AsyncStorage.getItem('phone');
        let imageUrl = await AsyncStorage.getItem('profileImageUrl');
        const userId = await AsyncStorage.getItem('userId');

        if (name) setFullName(name);
        if (phoneNumber) setPhone(phoneNumber);

        // Remove accidental quotes if any
        if (imageUrl) {
          imageUrl = imageUrl.replace(/^"|"$/g, '');
        }

        // If no valid image, fetch from API
        if ((!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') && userId) {
          const res = await axios.get(
            `${BASE_API_URL}/api/Services/GetUserById?uniqueId=${userId}`
          );
          if (res.status === 200 && res.data?.profileImageUrl) {
            imageUrl = res.data.profileImageUrl;
          }
        }

        // ✅ Normalize image URL (prepend BASE_URL if relative)
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `${BASE_API_URL}${imageUrl}`;
        }

        if (imageUrl) {
          setProfileImage(imageUrl);
          await AsyncStorage.setItem('profileImageUrl', imageUrl);
        }
      } catch (error) {
        console.warn('Failed to load user data', error);
      }
    };

    loadUserData();
  }, []);

  const navigateTo = (screen) => {
    setDrawerVisible(false);
    navigation.navigate(screen);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Image
            source={require('../assets/menu.png')}
            style={[styles.menuIcon, { tintColor: '#fff' }]}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* DRAWER */}
      {drawerVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setDrawerVisible(false)}
        >
          <View style={styles.drawer}>
            <View style={styles.profileContainer}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../assets/profiled.png')
                }
                style={styles.avatar}
              />
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.subtitle}>{phone || 'No phone available'}</Text>
            </View>

            <ScrollView style={styles.menuContainer}>
              <DrawerItem
                icon={require('../assets/icons/home.png')}
                label="Dashboard"
                onPress={() => navigateTo('Dashboard')}
              />
              <DrawerItem
                icon={require('../assets/icons/booking.png')}
                label="Book Appointment"
                onPress={() => navigateTo('BookingScreen')}
              />
              <DrawerItem
                icon={require('../assets/icons/calendar.png')}
                label="My Bookings"
                onPress={() => navigateTo('MyBookings')}
              />
              <DrawerItem
                icon={require('../assets/icons/credit.png')}
                label="Payment History"
                onPress={() => navigateTo('PaymentHistoryScreen')}
              />
              <DrawerItem
                icon={require('../assets/icons/padlock.png')}
                label="Change Password"
                onPress={() => navigateTo('ChangePasswordScreen')}
              />
              <DrawerItem
                icon={require('../assets/icons/info.png')}
                label="About Rashid Bahattab"
                onPress={() => navigateTo('AboutScreen')}
              />
              <DrawerItem
                icon={require('../assets/icons/question.png')}
                label="Help & Info"
                onPress={() => navigateTo('HelpInfoScreen')}
              />
              <DrawerItem
                icon={require('../assets/icons/logout.png')}
                label="Logout"
                onPress={() => navigation.navigate('Logout')}
              />
              {/* <DrawerItem
                icon={require('../assets/icons/delete.png')}
                label="Delete Account"
                 onPress={() => navigateTo('Delete')}
                style={{ backgroundColor: 'transparent' }}
                iconStyle={{ tintColor: 'red' }}
                labelStyle={{ color: 'red', fontWeight: 'bold' }}
              /> */}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}

      {/* SCREEN CONTENT */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const DrawerItem = ({ icon, label, onPress, style, iconStyle, labelStyle }) => (
  <TouchableOpacity style={[styles.menuItem, style]} onPress={onPress}>
    {icon && <Image source={icon} style={[styles.menuIconItem, iconStyle]} resizeMode="contain" />}
    <Text style={[styles.label, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  headerContainer: {
    height: 45,
    backgroundColor: '#0D5EA6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 25,
    height: 25,
    tintColor: '#0D5EA6',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 55,
    left: 0,
    width,
    height: height - 55,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    zIndex: 999,
  },
  drawer: {
    width: width * 0.75,
    backgroundColor: '#fff',
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  menuIconItem: {
    width: 20,
    height: 20,
    tintColor: '#0D5EA6',
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

export default MainLayout;
