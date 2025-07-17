import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CustomDrawer = ({ visible, onClose }) => {
  const [fullName, setFullName] = useState('Guest');
  const navigation = useNavigation(); // ✅ This gives you the navigation object

  useEffect(() => {
    const fetchName = async () => {
      try {
        const name = await AsyncStorage.getItem('customerFullName');
        if (name) setFullName(name);
      } catch (error) {
        console.warn('Failed to load name', error);
      }
    };

    fetchName();
  }, []);

  if (!visible) return null;

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.drawer}>
        <View style={styles.headerBackground} />

        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/rashid.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.subtitle}>70 Events</Text>
        </View>

        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          <DrawerItem icon="🏠" label="Dashboard" onPress={() => { navigation.navigate('Dashboard'); onClose(); }} />

          <DrawerItem icon="🔍" label="History" onPress={() => {}} />
          <DrawerItem icon="📝" label="Change Password" onPress={() => {}} />
          <DrawerItem icon="⚙️" label="Settings" onPress={() => {}} />
          <DrawerItem icon="ℹ️" label="About" onPress={() => {}} />
        </ScrollView>

        <TouchableOpacity style={styles.logoutContainer} onPress={() => {/* Add logout logic here */}}>
          <Text style={styles.logoutText}>↩️ Sign Out</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const DrawerItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
    backgroundColor: '#C5E1E8',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  icon: {
    fontSize: 18,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  logoutContainer: {
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  logoutText: {
    color: '#D22B2B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomDrawer;
