import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import MainLayout from '../components/MainLayout';
import axios from 'axios';

const PaymentHistoryScreen = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceMap, setServiceMap] = useState({});
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        'http://appointment.bitprosofttech.com/api/Services/api/services/GetAllServices'
      );
      const services = response.data;
      const map = {};
      services.forEach((service) => {
        map[service.uniqueId] = service.name;
      });
      setServiceMap(map);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchServices();
      await fetchPaymentHistory();
    };
    initialize();
  }, []);


  const fetchPaymentHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const phone = await AsyncStorage.getItem('phone');

      const response = await fetch(
        `http://appointment.bitprosofttech.com/api/Payment/get-payments-by-phone/${phone}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      console.log('Payment History Response:', result);
  
      setPaymentHistory(result || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.service}>{serviceMap[item.serviceId] || 'Unknown Service'}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>د.إ {item.amount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {moment(item.createdDate).format('DD MMM YYYY, hh:mm A')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.status, {
          color: item.paymentStatus === 'Failed' ? 'red' : 'green'
        }]}>
          {item.paymentStatus || 'Completed'}
        </Text>
      </View>
    </View>
  );

  return (
    <MainLayout title="Payment History">
      <SafeAreaView style={styles.container}>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 50 }} />
        ) : paymentHistory.length === 0 ? (
          <Text style={styles.noData}>No payment history available.</Text>
        ) : (
          <FlatList
            data={paymentHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </SafeAreaView>
    </MainLayout>
  );
};

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6200ee',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    elevation: 2,
  },
  service: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#555',
  },
  value: {
    fontSize: 13,
    color: '#000',
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#888',
  },
  list: {
    paddingBottom: 20,
  },
});
