import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import MainLayout from '../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';


const { width } = Dimensions.get('window');
const boxSize = width / 2.6;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <MainLayout title= {t('dashboard')}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>

          {/* Book a Talk */}
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('BookingScreen')}>
            <Image
              source={require('../assets/icons/microphone.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.boxTitle}>{t('bookTalk')}</Text>
          </TouchableOpacity>

          {/* Share Your Story */}
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('ContactUsScreen')}>
            <Image
              source={require('../assets/icons/chat.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.boxTitle}>{t('contactUs')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.box}
            onPress={() =>
              navigation.navigate('ContactUsScreen', { defaultCategory: 'Brand Collaboration' })
            }
          >
            <Image
              source={require('../assets/icons/deal.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.boxTitle}>{t('collaboration')}</Text>
          </TouchableOpacity>



          {/* My Bookings */}
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('MyBookings')}>
            <Image
              source={require('../assets/icons/calendar.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.boxTitle}>{t('myBookings')}</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('UpdateProfileScreen')}>
            <Image
              source={require('../assets/icons/user.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.boxTitle}>{t('profile')}</Text>
          </TouchableOpacity>

          {/* Help & Info */}
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('HelpInfoScreen')}>
            <Image
              source={require('../assets/icons/info.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.boxTitle}>{t('helpInfo')}</Text>
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
  icon: {
    width: 30,
    height: 30,
    tintColor: '#0D5EA6', // remove if you want original colors
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
