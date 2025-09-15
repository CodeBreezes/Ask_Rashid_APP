import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomAlertModal from '../components/CustomAlertModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainLayout from '../components/MainLayout';
import { useRoute } from '@react-navigation/native';

const StyledDropdown = ({ label, items, selectedValue, onSelect, placeholder = "Select an option" }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdownButton}>
        <Text style={selectedValue ? styles.dropdownText : styles.dropdownPlaceholder}>
          {selectedValue || placeholder}
        </Text>
        <AntDesign name="down" size={16} color="#6E7C8B" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ContactUsScreen = () => {
  const route = useRoute();
  const defaultCategory = route.params?.defaultCategory || '';

  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const categoryOptions = [
    { label: "Brand Collaboration", value: "BrandCollaboration" },
    { label: "Feedback / Suggestions", value: "FeedbackSuggestions" },
    { label: "Complaint Issue", value: "ComplaintIssue" },
    { label: "General Enquiry", value: "GeneralEnquiry" },
  ];

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('customerFullName');
      const emailStored = await AsyncStorage.getItem('email');

      setUserId(id || '');
      setFullName(name || '');
      setEmail(emailStored || '');

      // Set default category if passed
      if (defaultCategory) {
        setCategory(defaultCategory);
      }
    })();
  }, []);

  const showModal = (title, message) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!category) {
      return showModal('Validation Error', 'Please select a category.');
    }
    if (!message.trim()) {
      return showModal('Validation Error', 'Please enter your message.');
    }

    setLoading(true);
    try {
      const payload = {
        userId: Number(userId),
        name: fullName,
        email: email,
        category: category.replace(/\s+/g, ''),
        message: message,
      };

      const res = await axios.post(
        'http://appointment.bitprosofttech.com/api/Feedbacks',
        payload
      );

      if (res.status === 200 || res.status === 201) {
        showModal('✅ Success', 'Your feedback has been submitted successfully.');
        setCategory('');
        setMessage('');
      } else {
        showModal('Error', 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error(err);
      showModal('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Contact Us">

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>

          <Text style={styles.subHeaderText}>
            Please fill out the form below and we'll get back to you as soon as possible.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={fullName}
              editable={false}
              style={[styles.input, styles.inputDisabled]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              editable={false}
              style={[styles.input, styles.inputDisabled]}
            />
          </View>

          <StyledDropdown
            label="Category"
            items={categoryOptions}
            selectedValue={
              categoryOptions.find(item => item.value === category)?.label
            }
            onSelect={setCategory}
            placeholder="-- Select Category --"
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              placeholder="Write your message here..."
              placeholderTextColor="#999"
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlertModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={() => setModalVisible(false)}
      />

    </MainLayout>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1 },
  container: { padding: 24 },
  subHeaderText: {
    fontSize: 16,
    color: '#6E7C8B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 25,
    padding: 14,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputDisabled: { backgroundColor: '#EAEFF4', color: '#6E7C8B' },
  textArea: { height: 120, paddingTop: 14 },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownText: { fontSize: 16, color: '#333' },
  dropdownPlaceholder: { fontSize: 16, color: '#999' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEFF4',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#0D5EA6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#0D5EA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#6C757D',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default ContactUsScreen;
