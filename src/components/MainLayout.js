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

const { width, height } = Dimensions.get('window');

const MainLayout = ({ title, children }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fullName, setFullName] = useState('Guest');
  const navigation = useNavigation();

  useEffect(() => {
    const loadName = async () => {
      const name = await AsyncStorage.getItem('customerFullName');
      if (name) setFullName(name);
    };
    loadName();
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
          <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* DRAWER */}
      {drawerVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setDrawerVisible(false)}>
          <View style={styles.drawer}>
            <View style={styles.headerBackground} />
            <View style={styles.profileContainer}>
              <Image source={require('../assets/rashidprofile.jpg')} style={styles.avatar} />
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.subtitle}>Customer</Text>
            </View>

            <ScrollView style={styles.menuContainer}>
              <DrawerItem label="🏠 Dashboard" onPress={() => navigateTo('Dashboard')} />
              <DrawerItem label="🏠   Home" onPress={() => navigateTo('Home')} />
              <DrawerItem label="📋 Book Appointment" onPress={() => navigateTo('BookingScreen')} />
              <DrawerItem label="📝 My Bookings" onPress={() => navigateTo('MyBookings')} />
                 <DrawerItem label="📝 Payment History" onPress={() => navigateTo('PaymentHistoryScreen')} />
              <DrawerItem label="👤 Change Password" onPress={() => navigateTo('Dashboard')} />
              <DrawerItem label="🚪 Logout"  onPress={() => navigation.navigate('Logout')}/>
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}

      {/* SCREEN CONTENT */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const DrawerItem = ({ label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  headerContainer: {
    height: 55,
    backgroundColor: '#EAA64D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 25,
    height: 25,
    tintColor: '#fff',
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
  headerBackground: {
    position: 'absolute',
    top: -70,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'white',
    zIndex: -1,
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
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
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
