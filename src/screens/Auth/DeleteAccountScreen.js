import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API_URL } from '../../api/apiConfig';

const DeleteAccountScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      const email = await AsyncStorage.getItem("email");
      if (email) setUserEmail(email);
    };
    loadUserData();
  }, []);

  const handleConfirmDelete = async () => {
    if (!userEmail) {
      Alert.alert("Error", "Email not found. Cannot proceed.");
      return;
    }

    try {
      setLoading(true);

      // Correct API call with email as query string
      const url = `${BASE_API_URL}/api/Services/DeleteAccount?email=${encodeURIComponent(
        userEmail
      )}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      const data = await res.text();
      console.log("Delete Account response:", res.status, data);

      if (res.status === 200) {
        Alert.alert(
          "Success",
          "A link has been sent to your registered email to delete your account.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
            },
          ]
        );
      } else {
        Alert.alert("Error", data || "Failed to send delete account link.");
      }
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "Something went wrong while sending delete link.");
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>⚠️ Are you sure?</Text>
            <Text style={styles.message}>
              This action will **permanently** delete your account and all
              associated data.
            </Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.goBack();
                }}
                disabled={loading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>Delete Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#dc3545",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 24,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#e9ecef",
  },
  confirmButton: {
    backgroundColor: "#dc3545",
  },
  cancelText: {
    color: "#495057",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
