// App.js
import React, { useEffect } from "react";
import { View, StatusBar, Text, TextInput } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import i18n from "./src/i18n"; 

function MainLayout({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: "#FFF",
      }}
    >
      {children}
    </View>
  );
}

const App = () => {
  useEffect(() => {
    const fontFamily =
      i18n.language === "ar" ? "NotoKufiArabic-Regular" : undefined;

    console.log("Current Language:", i18n.language);
    console.log("Font Applied:", fontFamily);

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = [
      Text.defaultProps.style,
      { fontFamily: fontFamily },
    ];

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.style = [
      TextInput.defaultProps.style,
      { fontFamily: fontFamily },
    ];
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D5EA6"
        translucent={false}
      />

      <MainLayout>
        <AppNavigator />
      </MainLayout>
    </SafeAreaProvider>
  );
};

export default App;
