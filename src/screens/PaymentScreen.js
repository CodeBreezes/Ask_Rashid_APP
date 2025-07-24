// screens/PaymentScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  Text,
  ScrollView,
} from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://appointment.bitprosofttech.com/api/Payment';

const PaymentInnerScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const route = useRoute();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const bookingData = route.params?.bookingData;

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
        const intentId = data.clientSecret.split('_secret')[0];
        setPaymentIntentId(intentId);
      } else {
        throw new Error('Client secret not received');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Ask Rashid',
    });

    if (!error) {
      openPaymentSheet();
    } else {
      Alert.alert('Init Error', error.message);
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert('Payment Failed', error.message);
    } else {
      Alert.alert('Success', 'Payment successful!');
      fetchPaymentDetails();
    }

    setLoading(false);
  };

  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get-payment-by-bookingid/${bookingData.bookingId}`);
      const data = await res.json();
      setPaymentResult(data);
    } catch (err) {
      Alert.alert('Failed to fetch payment details', err.message);
    }
  };

  useEffect(() => {
    fetchPaymentSheetParams();
  }, []);

  useEffect(() => {
    if (clientSecret) {
      initializePaymentSheet();
    }
  }, [clientSecret]);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Processing Payment...</Text>
        </View>
      )}
      {!loading && paymentResult && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.title}>Payment Successful 🎉</Text>
          {Object.entries(paymentResult).map(([key, value]) => (
            <Text key={key} style={styles.line}>
              {key}: {value}
            </Text>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default function PaymentScreenWrapper() {
  return (
    <StripeProvider publishableKey="pk_test_51RYkoFP0IEEQYhPOMWhlS8I0qRN1JD2h4B2PpRJCiK1E0i1UDh2iNhRh0yOFm29mwTLh2H02VcucxOXnwKNWgXtv00I4LcFPWn">
      <PaymentInnerScreen />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: 'green',
  },
  line: {
    marginBottom: 6,
    fontSize: 15,
  },
});
