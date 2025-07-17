import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MainLayout from '../components/MainLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SERVICE_NAMES = {
  1: '1 to 1 Live Counseling Session',
  2: 'Share Your Story',
  3: 'Book a Talk',
  4: 'Brand Collaborations',
};

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get('http://appointment.bitprosofttech.com/api/Bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filtered = response.data.filter(
        (booking) => booking.userId.toString() === userId
      );
      setBookings(filtered);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <FontAwesome5 name="wrench" size={18} color="#7442FF" />
        <Text style={styles.label}>Service:</Text>
        <Text style={styles.value}>{SERVICE_NAMES[item.serviceId] || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <MaterialIcons name="date-range" size={20} color="#7442FF" />
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{formatDate(item.startedDate)}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="clock" size={18} color="#7442FF" />
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{formatTime(item.startedTime)}</Text>
      </View>
    </View>
  );

  return (
    <MainLayout title="My Bookings">
      {loading ? (
        <ActivityIndicator size="large" color="#7442FF" style={{ marginTop: 50 }} />
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.uniqueId.toString()}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <FontAwesome5 name="calendar-times" size={40} color="#bbb" />
          <Text style={styles.noDataText}>You have no bookings yet.</Text>
        </View>
      )}
    </MainLayout>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
    width: 80,
  },
  value: {
    fontSize: 15,
    color: '#555',
    flexShrink: 1,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 18,
    color: '#888',
  },
});

export default MyBookingsScreen;
