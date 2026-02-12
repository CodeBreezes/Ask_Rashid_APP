import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./translations/en.json";
import ar from "./translations/ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const languageDetector = {
  type: "languageDetector",
  async: true,

  detect: async (callback) => {
    try {
      const savedLang = await AsyncStorage.getItem("APP_LANGUAGE");

      if (savedLang) {
        callback(savedLang); // ✅ load saved language
      } else {
        callback(null); // ✅ no default language
      }
    } catch (error) {
      callback(null);
    }
  },

  init: () => {},

  cacheUserLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem("APP_LANGUAGE", lang);
    } catch (error) {
      console.log("Language save error:", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: false, 
    lng: undefined, 
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
