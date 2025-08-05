import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Modal,
  FlatList, Alert, Platform, ActivityIndicator, KeyboardAvoidingView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import styles from '../styles/BookingScreen.styles';
import { postBooking } from '../api/bookingApi';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';



const BookingScreen = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [services, setServices] = useState([]);
  const [detailedServices, setDetailedServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [selectedServiceDescription, setSelectedServiceDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const serviceApiUrl = 'http://appointment.bitprosofttech.com/api/Services';
  const serviceDetailsApiUrl = 'http://appointment.bitprosofttech.com/api/Services/api/services/GetAllServices';

  const formatServiceDescription = (serviceId) => {
    const detailedService = detailedServices.find(s => s.uniqueId === serviceId);
    if (!detailedService) return 'No description available.';

    let desc = `📌 ${detailedService.name}\n\n${detailedService.description}\n\n`;

    detailedService.subtopics?.forEach((sub) => {
      desc += `🔹 ${sub.title}\n`;
      sub.bulletins?.forEach((b) => {
        desc += `  • ${b.content.trim()}\n`;
      });
      desc += '\n';
    });

    return desc.trim();
  };

  useEffect(() => {
    axios.get(serviceApiUrl)
      .then((res) => setServices(res.data))
      .catch(() => Alert.alert('Error', 'Unable to load basic services'));

    axios.get(serviceDetailsApiUrl)
      .then((res) => setDetailedServices(res.data))
      .catch(() => Alert.alert('Error', 'Unable to load service descriptions'));

    const fetchUserData = async () => {
      const fullName = await AsyncStorage.getItem('customerFullName');
      const id = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');
      const phone = await AsyncStorage.getItem('phone');
      debugger;
      if (fullName) setName(fullName);
      if (id) setUserId(id);
      if (email) setEmail(email);
      if (phone) setPhone(phone);
    };

    fetchUserData();
  }, []);


  const handlePaymentBooking = async () => {
    if (!serviceId || !userId || !topic.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const startedDate = date.toISOString().split('T')[0];
    const startedTime = time.toTimeString().split(' ')[0] + '.' + String(time.getMilliseconds()).padStart(3, '0');

    const bookingId = `BK-${uuid.v4()}`;


    const selectedService = services.find(s => s.uniqueId === serviceId);
    const amount = selectedService?.cost || 0;
    const payload = {
      serviceId,
      userId: parseInt(userId),
      startedDate,
      startedTime,
      topic,
      notes,
      amount,
      currency: 'AED',
      customerName: name,
      email,
      phoneNumber: phone,
      stripePaymentIntentId: '',
      bookingId,
      createdAt: new Date().toISOString(),
    };
debugger;
    navigation.navigate('PaymentScreen', { bookingData: payload });
  };

  const selectedService = services.find(s => s.uniqueId === serviceId);

  return (
    <MainLayout title="Book Appointment">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.pageContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.label}>Welcome, {name}</Text>
            <Text style={styles.label}>Welcome, {name}</Text>
            <Text style={styles.label}>Select Service</Text>
            <TouchableOpacity
              style={styles.dropdownTouchable}
              onPress={() => setServiceModalVisible(true)}
            >
              <Text style={styles.dropdownText}>
                {selectedService
                  ? `${selectedService.name} - د.إ ${selectedService.cost}`
                  : 'Choose a service'}
              </Text>
            </TouchableOpacity>

            {/* Service Modal */}
            <Modal visible={serviceModalVisible} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { maxHeight: '85%' }]}>
                  <Text style={styles.modalTitle}>Select a Service</Text>

                  <FlatList
                    data={services}
                    keyExtractor={(item) => item.uniqueId.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.serviceCard}
                        onPress={() => {
                          setServiceId(item.uniqueId);
                          setServiceModalVisible(false);
                        }}
                      >
                        <View style={styles.serviceRow}>
                          <Text style={styles.serviceName}>{item.name}</Text>
                          <Text style={styles.serviceCost}>د.إ {item.cost}</Text>
                        </View>
                        <View style={styles.eyeButtonContainer}>
                          <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => {
                              setSelectedServiceDescription(formatServiceDescription(item.uniqueId));
                              setDescriptionModalVisible(true);
                            }}
                          >
                            <Text style={styles.detailsButtonText}>View Details</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    )}
                  />

                  <TouchableOpacity style={styles.modalClose} onPress={() => setServiceModalVisible(false)}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Description Modal */}
            <Modal visible={descriptionModalVisible} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { maxHeight: '85%' }]}>
                  <Text style={styles.modalTitle}>Service Description</Text>
                  <ScrollView style={{ marginBottom: 20 }} showsVerticalScrollIndicator>
                    <Text style={{ color: '#222', fontSize: 14, fontWeight: '500', lineHeight: 20 }}>
                      {selectedServiceDescription}
                    </Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setDescriptionModalVisible(false)}
                  >
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Text style={styles.label}>Enter Topic</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter topic"
              value={topic}
              onChangeText={setTopic}
            />

            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Additional notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {date ? `📆 ${date.toDateString()}` : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    minimumDate={new Date()}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {time ? `🕒 ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select Time'}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) setTime(selectedTime);
                    }}
                  />
                )}
              </View>
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handlePaymentBooking} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.bookButtonText}>Confirm & Pay</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </MainLayout>
  );
};

export default BookingScreen;
