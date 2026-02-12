import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import i18n from "../../i18n";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import Texts from "../../components/Texts";

const { width, height } = Dimensions.get("window");


const LandingScreen = () => {
     const navigation = useNavigation();
    useEffect(() => {
  const loadLang = async () => {
    const savedLang = await AsyncStorage.getItem("APP_LANGUAGE");

    if (savedLang) {
      await i18n.changeLanguage(savedLang);
      navigation.replace("Home"); 
    }
  };
    loadLang();
  }, []);

  const handleLanguageSelect = async (lang) => {
    await AsyncStorage.setItem("APP_LANGUAGE", lang);
    await i18n.changeLanguage(lang);
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>

      {/* Logo Section */}
      <View style={styles.logoBox}>
       
          <Image
            source={require("../../assets/Eng_Ara.png")}
            style={styles.logo}
          />
      
      </View>

      {/* Language Box */}
      <View style={styles.languageBox}>
        
        <TouchableOpacity
          style={styles.englishBtn}
          onPress={() => handleLanguageSelect("en")}
        >
          <Texts style={styles.englishText}>English</Texts>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arabicBtn}
          onPress={() => handleLanguageSelect("ar")}
        >
          <Texts style={styles.arabicText}>Arabic</Texts>
        </TouchableOpacity>

      </View>

    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  logoBox: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F3FFF4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },

logo: {
  width: width * 0.45,    
  height: width * 0.45,   
  resizeMode: "contain",
},


  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },

  subText: {
    fontSize: 14,
    color: "#777",
  },

  languageBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  selectText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },

  englishBtn: {
    width: "100%",
    backgroundColor: "#0D5EA6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  englishText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  arabicBtn: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },

  arabicText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },

  noteText: {
    marginTop: 18,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
});
