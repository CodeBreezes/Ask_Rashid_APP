import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Modal,
  FlatList, Alert, Platform, ActivityIndicator, KeyboardAvoidingView
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Changed import
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import styles from '../styles/BookingScreen.styles';
import { postBooking } from '../api/bookingApi';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { Dimensions } from 'react-native';
import { BASE_API_URL } from '../api/apiConfig';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

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
  const [serviceLoading, setServiceLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const route = useRoute();
  const [slotId, setSlotId] = useState(null);
  const serviceApiUrl = `${BASE_API_URL}/api/Services`;
  const serviceDetailsApiUrl = `${BASE_API_URL}/api/Services/api/services/GetAllServices`;

  const formatServiceDescription = (serviceId) => {
    if (!Array.isArray(detailedServices)) return 'Service details not available.';

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
    if (route.params?.startedDate && route.params?.startedTime) {
      setDate(new Date(route.params.startedDate));
      setTime(new Date(`1970-01-01T${route.params.startedTime}`));
      setSlotId(route.params.slotId);
    }
  }, [route.params]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setServiceLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Session Expired. Please login again.');
          return;
        }

        axios.get(serviceApiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => setServices(res.data))
          .catch(() => Alert.alert('Error', 'Unable to load basic services'));


        axios.get(serviceDetailsApiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => setDetailedServices(res.data))
          .catch(() => Alert.alert('Error', 'Unable to load service descriptions'));

        const fullName = await AsyncStorage.getItem('customerFullName');
        const id = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');
        const phone = await AsyncStorage.getItem('phone');

        if (fullName) setName(fullName);
        if (id) setUserId(id);
        if (email) setEmail(email);
        if (phone) setPhone(phone);
      } catch (error) {
        console.error('Error in useEffect:', error);
      } finally {
        setServiceLoading(false);
      }
    };

    fetchData();
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
      endedTime: route.params.endedTime,
    };
    navigation.navigate('PaymentScreen', { bookingData: payload });
  };

  const selectedService = services.find(s => s.uniqueId === serviceId);

  // New handler functions for date and time picker
  const handleDateConfirm = (selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const handleTimeConfirm = (selectedTime) => {
    setShowTimePicker(false);
    setTime(selectedTime);
  };
  const { t } = useTranslation();

  return (
    <MainLayout title= {t('bookAppointment')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.pageContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.label}> {t('welcome')}, {name}</Text>
            <Text style={styles.label}>{t('bookingIntro')}</Text>
            <Text style={styles.label}>{t('selectService')}</Text>
            <TouchableOpacity
              style={styles.dropdownTouchable}
              onPress={async () => {
                setServiceModalVisible(true);
                setServiceLoading(true);

                try {
                  const token = await AsyncStorage.getItem('token');
                  if (!token) {
                    Alert.alert('Error', 'Session expired. Please login again.');
                    setServiceLoading(false);
                    return;
                  }

                  const [basicRes, detailedRes] = await Promise.all([
                    axios.get(`${BASE_API_URL}/api/Services`, {
                      headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${BASE_API_URL}/api/Services/api/services/GetAllServices`, {
                      headers: { Authorization: `Bearer ${token}` },
                    }),
                  ]);

                  setServices(basicRes.data);
                  setDetailedServices(detailedRes.data);
                } catch (error) {
                  console.error('Error fetching services:', error);
                  Alert.alert('Error', 'Unable to load services.');
                } finally {
                  setServiceLoading(false);
                }
              }}
            >
              <Text style={styles.dropdownText}>
                {selectedService
                  ? `${selectedService.name} - د.إ ${selectedService.cost}`
                  :  t('chooseService')}
              </Text>
            </TouchableOpacity>



            {/* Service Modal */}
            <Modal visible={serviceModalVisible} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { maxHeight: '85%' }]}>
                  <Text style={styles.modalTitle}>{t('selectService')}</Text>

                  {serviceLoading ? (
                    // Loader while services are fetching
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                      <ActivityIndicator size="large" color="#000" />
                      <Text style={{ marginTop: 10, color: '#555', fontSize: 14 }}> {t('loadingServices')}</Text>
                    </View>
                  ) : (
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
                              <Text style={styles.detailsButtonText}>{t('viewDetails')}</Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                  <TouchableOpacity style={styles.modalClose} onPress={() => setServiceModalVisible(false)}>
                    <Text style={styles.modalCloseText}>{t('close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


            {/* Description Modal */}
            <Modal visible={descriptionModalVisible} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View
                  style={[
                    styles.modalContent,
                    { maxHeight: screenHeight * 0.8 } // ✅ responsive max height (80% of device)
                  ]}
                >
                  <Text style={styles.modalTitle}>{t('serviceDescription')}</Text>

                  {/* ✅ Scrollable content area */}
                  <View style={{ flex: 1 }}>
                    <ScrollView
                      style={{ flex: 1, marginBottom: 10 }}
                      contentContainerStyle={{ paddingBottom: 20 }}
                      showsVerticalScrollIndicator={true}
                    >
                      <Text style={{ color: '#222', fontSize: 14, fontWeight: '500', lineHeight: 20 }}>
                        {selectedServiceDescription}
                      </Text>
                    </ScrollView>


                    {/* ✅ Close button stays fixed below scroll */}
                    <TouchableOpacity
                      style={styles.modalClose}
                      onPress={() => setDescriptionModalVisible(false)}
                    >
                      <Text style={styles.modalCloseText}>{t('close')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Text style={styles.label}>{t('enterTopic')}</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder={t('enterTopicPlaceholder')}
              placeholderTextColor="#888"
              value={topic}
              multiline
              numberOfLines={2}
              onChangeText={setTopic}
            />

            <Text style={styles.label}>{t('additionalNotes')}</Text>
            <TextInput
              style={[styles.input, { height: 100, borderRadius: 25, textAlignVertical: 'top' }]}
              placeholder={t('additionalNotesPlaceholder')}
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />
            {/*
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {date ? `📆 ${date.toDateString()}` : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {time ? `🕒 ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select Time'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setShowDatePicker(false)}
              date={date}
              minimumDate={new Date()}
            />

            <DateTimePickerModal
              isVisible={showTimePicker}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={() => setShowTimePicker(false)}
              date={time}
            />
            End of New Modal Pickers */}
            <Text style={styles.label}>{t('selectDateTime')}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('SlotPicker')}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {slotId
                  ? `📅 ${date.toDateString()}  🕒 ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  :  t('selectAvailableSlot')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bookButton} onPress={handlePaymentBooking} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.bookButtonText}>{t('confirmAndPay')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {
        loading && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )
      }
    </MainLayout >
  );
};

export default BookingScreen;