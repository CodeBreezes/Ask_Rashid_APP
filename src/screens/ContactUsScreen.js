import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomAlertModal from '../components/CustomAlertModal';
import MainLayout from '../components/MainLayout';
import { BASE_API_URL } from '../api/apiConfig';
import { useTranslation } from 'react-i18next';

const ContactUsScreen = () => {
  const route = useRoute();
  const defaultCategory = route.params?.defaultCategory || '';

  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(defaultCategory || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const categoryOptions = [
    { label: t('brandCollaboration'), value: 'BrandCollaboration' },
    { label: t('feedbackSuggestions'), value: 'FeedbackSuggestions' },
    { label: t('complaintIssue'), value: 'ComplaintIssue' },
    { label: t('generalEnquiry'), value: 'GeneralEnquiry' },
  ];

  const { t } = useTranslation();

  const isCategoryReadonly = defaultCategory === 'Brand Collaboration';

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('customerFullName');
      const emailStored = await AsyncStorage.getItem('email');

      setUserId(id || '');
      setFullName(name || '');
      setEmail(emailStored || '');

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
      return showModal(t('validationError'), t('selectCategoryError'));
    }
    if (!message.trim()) {
      return showModal(t('validationError'), t('enterMessageError'));
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
        `${BASE_API_URL}/api/Feedbacks`,
        payload
      );

      if (res.status === 200 || res.status === 201) {
        showModal(t('success'), t('formSubmitted'));
        if (!isCategoryReadonly) setCategory('');
        setMessage('');
      } else {
        showModal(t('Error'), t('submitFailed'));
      }
    } catch (err) {
      console.error(err);
      showModal(t('Error'), t('somethingWentWrong'));

    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title= {t('contactUs')}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subHeaderText}>
          {t('contactIntro')}
        </Text>


        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('Name')}</Text>
          <TextInput
            value={fullName}
            editable={false}
            style={[styles.input, styles.inputDisabled]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.inputDisabled]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('category')}</Text>

          {isCategoryReadonly ? (
            <Text style={styles.readonlyText}>{category}</Text>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                <Picker.Item label={t('selectCategory')}  value="" />
                {categoryOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('message')}</Text>
          <TextInput
            placeholder={t('messagePlaceholder')}
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
            <Text style={styles.submitButtonText}> {t('submit')}</Text>
          )}
        </TouchableOpacity>

        <CustomAlertModal
          visible={modalVisible}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={() => setModalVisible(false)}
        />
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#6E7C8B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
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
  },
  inputDisabled: {
    backgroundColor: '#EAEFF4',
    color: '#6E7C8B',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },

  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  readonlyText: {
    padding: 14,
    backgroundColor: '#e9ecef',
    borderRadius: 25,
    fontSize: 16,
    color: '#555',
  },
  textArea: {
    height: 120,
    paddingTop: 14,
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
