import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MainLayout from '../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import { BASE_API_URL } from '../api/apiConfig';
import { useTranslation } from 'react-i18next';
import Texts from "../components/Texts";

const HelpInfoScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <MainLayout title={t('helpInfo')}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* How to Book */}
          <View style={styles.section}>
            <Texts style={styles.sectionTitle}>
              <Icon name="clipboard-list" size={18} /> {t('howToBookTitle')}
            </Texts>

            {t('steps', { returnObjects: true }).map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <Texts style={styles.stepNumber}>{index + 1}.</Texts>
                <Texts style={styles.stepText}>{step}</Texts>
              </View>
            ))}
          </View>


          {/* After Booking */}
          <View style={styles.section}>
            <Texts style={styles.sectionTitle}>
              <Icon name="phone" size={18} /> {t('afterBookingTitle')}
            </Texts>
            <Texts style={styles.paragraph}>
              {t('afterBookingText')}            </Texts>
          </View>

          {/* Payment Info */}
          <View style={styles.section}>
            <Texts style={styles.sectionTitle}>
              <Icon name="credit-card" size={18} />  {t('paymentTitle')}
            </Texts>
            <Texts style={styles.paragraph}>
              {t('paymentText')} </Texts>
          </View>

          {/* Rescheduling */}
          <View style={styles.section}>
            <Texts style={styles.sectionTitle}>
              <Icon name="calendar-alt" size={18} /> {t('rescheduleTitle')}
            </Texts>
            <Texts style={styles.paragraph}>
              {t('rescheduleText')}  </Texts>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Texts style={styles.sectionTitle}>
              <Icon name="headset" size={18} /> {t('contactTitle')}
            </Texts>
            <Texts style={styles.paragraph}> {t('contactText')}</Texts>
            <TouchableOpacity onPress={() => navigation.navigate('ContactUsScreen')}>
              <Texts style={styles.link}>💬 {t('contactUs')}</Texts>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:info@rashidbahattab.com')}>
              <Texts style={[styles.link, { marginTop: 8 }]}>📧 info@rashidbahattab.com</Texts>
            </TouchableOpacity>
          </View>

          {/* Privacy */}
          <View style={styles.section}>
            <Texts style={styles.sectionTitle}>
              <Icon name="lock" size={18} /> {t('privacyTitle')}
            </Texts>
            <Texts style={styles.paragraph}>
              {t('privacyText')} </Texts>
            <TouchableOpacity onPress={() => Linking.openURL(`${BASE_API_URL}/service/PrivacyPolicy`)}>
              <Texts style={[styles.paragraph, { color: '#0D5EA6', textDecorationLine: 'underline' }]}>
                {t('privacyPolicy')}
              </Texts>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Texts style={styles.paragraph}>
              {t('termsAccepted')}</Texts>
               <TouchableOpacity onPress={() => Linking.openURL(`${BASE_API_URL}/userAccount/termsandconditions`)}>
                <Texts style={styles.link}>T&C</Texts>
              </TouchableOpacity>
          </View>
         

        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  );
};

export default HelpInfoScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D5EA6',
    textAlign: 'center',
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: '#0D5EA6',
    width: 20,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
  },
  paragraph: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  link: {
    color: '#0D5EA6',
    textDecorationLine: 'underline',
  },
});
