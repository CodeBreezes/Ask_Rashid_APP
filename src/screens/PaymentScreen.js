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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://appointment.bitprosofttech.com/api/Payment';

const PaymentInnerScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const route = useRoute();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const bookingData = route.params?.bookingData;

  if (!bookingData) {
    Alert.alert('Error', 'Booking data is missing');
    return null;
  }

  const fetchPaymentSheetParams = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (data?.clientSecret && data?.paymentIntentId) {
        setClientSecret(data.clientSecret);
        bookingData.stripePaymentIntentId = data.paymentIntentId; // ✅ Fix: Store it here
      } else {
        throw new Error('Client secret or paymentIntentId not received');
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
      setLoading(false);
    } else {
      try {
        const userIdFromStorage = await AsyncStorage.getItem('userId');
        const bookingPayload = {
          ...bookingData,
          userId: parseInt(userIdFromStorage || bookingData.userId),
        };
        const token = await AsyncStorage.getItem('token');
        const bookingRes = await fetch(`http://appointment.bitprosofttech.com/api/Bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(bookingPayload),
        });

        if (!bookingRes.ok) throw new Error('Booking failed');

        const res = await fetch(
          `${API_BASE_URL}/get-payment-by-bookingid/${bookingData.bookingId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Fetching payment by bookingId failed');
        const paymentData = await res.json();

        const paymentPayload = {
          stripePaymentIntentId: paymentData.id,
          customerName: bookingData.customerName,
          email: bookingData.email,
          phoneNumber: bookingData.phoneNumber,
          amount: bookingData.amount,
          currency: bookingData.currency,
          createdAt: new Date().toISOString(),
          bookingId: bookingData.bookingId,
          userId: parseInt(userIdFromStorage || bookingData.userId),
          serviceId: bookingData.serviceId,
        };

        const paymentRes = await fetch(`${API_BASE_URL}/save-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(paymentPayload),
        });

        if (!paymentRes.ok) throw new Error('Saving payment failed');

        const paymentSaved = await paymentRes.json();
        setPaymentResult(paymentSaved);

        Alert.alert(
          'Booking confirmed ✅',
          'Our team will get back to you soon..',
          [
            {
              text: 'Go to My Bookings',
              onPress: () => navigation.navigate('MyBookings'),
              style: 'default',
            },
          ],
          { cancelable: false }
        );

      } catch (err) {
        Alert.alert('Error', err.message);
      }

      setLoading(false);
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default function PaymentScreenWrapper() {
  return (
    <StripeProvider publishableKey="pk_test_51S7vZWIutE88E4iRMhuS7JGNNkBygOa1Jasd3RlKf5ZwfZy2Lia52pZ0450KozM0r2AurHXOEnSU0kY03VVCJM6200SBQqQuGt">
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
