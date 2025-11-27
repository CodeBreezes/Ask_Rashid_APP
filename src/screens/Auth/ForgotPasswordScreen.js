import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { BASE_API_URL } from '../../api/apiConfig';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("enter"); // "enter" | "check"
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const url = `${BASE_API_URL}/api/Services/ForgotPassword?email=${encodeURIComponent(
        email
      )}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      const data = await res.text();
      console.log("ForgotPassword response:", res.status, data);

      if (res.ok) {
        setStep("check");
        setTimeout(() => {
          navigation.navigate("Login");
        }, 5000);
      } else {
        Alert.alert("Failed", data || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    if (!email) return;
    handleResetPassword();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {step === "enter" ? (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Please enter your email to reset your password
          </Text>

          <Text style={styles.label}>Your Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@gmail.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Reset Password"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a reset link to{" "}
            {email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
            {"\n"}Please check your email to reset your password.
          </Text>

          <Text style={styles.subtitleSmall}>
            Haven’t got the email yet?{" "}
            <Text style={styles.link} onPress={handleResendEmail}>
              Resend email
            </Text>
          </Text>
        </>
      )}
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // slightly soft white for better visibility
    padding: 20,
  },
  backButton: { marginBottom: 20 },
  backArrow: { fontSize: 24, color: "#0D5EA6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#222" },
  subtitle: { fontSize: 15, color: "#333", marginBottom: 20, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#222" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    color: "#222",
  },
  button: {
    backgroundColor: "#0D5EA6",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  subtitleSmall: { fontSize: 14, color: "#444", marginTop: 20 },
  link: { color: "#0D5EA6", fontWeight: "600" },
});
