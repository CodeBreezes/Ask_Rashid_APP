import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import en from './translations/en.json';
import ar from './translations/ar.json';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL(false);

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    const savedLang = await AsyncStorage.getItem('APP_LANGUAGE');
    callback(savedLang || 'en');
  },
  init: () => {},
  cacheUserLanguage: async (lang) => {
    await AsyncStorage.setItem('APP_LANGUAGE', lang);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
