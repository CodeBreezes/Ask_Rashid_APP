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

const HelpInfoScreen = () => {

  const openPhone = () => Linking.openURL('tel:+971505706200');
  const openWhatsApp = () => Linking.openURL('https://wa.me/971505706200');
  const openEmail = () => Linking.openURL('mailto:info@rashidbahattab.com');

  return (
    <MainLayout title="Help & Info">
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
      
        {/* How to Book */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="clipboard-list" size={18} /> How to Book an Appointment?
          </Text>
          {[
            'Choose a Service\nBrowse through our list and pick the service you need.',
            'Type Your Topic & Description\nTell us what the appointment is about and briefly describe your concern or request — this helps us prepare better.',
            'Choose a Date & Time\nPick your preferred appointment slot based on availability.',
            'Confirm & Pay\nConfirm your details and pay securely via Stripe using your debit or credit card.',
            'Booking Confirmation\nOnce payment is done, your appointment is confirmed.',
          ].map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* After Booking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="phone" size={18} /> What Happens After Booking?
          </Text>
          <Text style={styles.paragraph}>
            Once your booking is confirmed, our team will reach out to you via call or WhatsApp to finalize the service details.
          </Text>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="credit-card" size={18} /> Payment Information
          </Text>
          <Text style={styles.paragraph}>
            All payments are processed securely through Stripe, one of the world's most trusted payment gateways. You can pay using your debit/credit card directly within the app.
            {'\n\n'}Once the payment is successful, you'll receive an on-screen confirmation and an optional email receipt.
          </Text>
        </View>

        {/* Rescheduling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="calendar-alt" size={18} /> Rescheduling or Cancelling?
          </Text>
          <Text style={styles.paragraph}>
            If you need to change your appointment, please contact our support team as soon as possible. Rescheduling options may depend on service availability.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="headset" size={18} /> Contact Support
          </Text>
          <TouchableOpacity onPress={openPhone}>
            <Text style={styles.link}>📞 Phone/WhatsApp: +971 50 570 6200</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openWhatsApp}>
            <Text style={styles.link}>💬 Chat on WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.link}>📧 Email: info@rashidbahattab.com</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="lock" size={18} /> Privacy & Data Security
          </Text>
          <Text style={styles.paragraph}>
            We value your privacy. All your personal and payment details are stored securely and are not shared with any third parties.
          </Text>
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
    color: '#5B2B82',
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
    color: '#5B2B82',
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
    fontSize: 15,
    color: '#5B2B82',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
});
