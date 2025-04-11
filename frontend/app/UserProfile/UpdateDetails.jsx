import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import config from "../../config";

const UpdateDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name: initialName, email: initialEmail } = route.params || {};
  const [name, setName] = useState(initialName || "");
  const [email] = useState(initialEmail || ""); // Email is not editable
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleUpdateName = async () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.patch(
        `${config.API_URL}/api/profile/updateName/${email}`,
        {
          newName: name,
        }
      );

      setMessage(response.data.message);
      setMessageType("success");
      setTimeout(() => {
        navigation.navigate("UserProfile", { refresh: true });
      }, 2000); // 2000ms = 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      setMessageType("error");
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !newPassword) {
      setMessage("Please fill in all password fields");
      setMessageType("error");
      return;
    }

    // Password strength check
    let temp = 0;
    if (newPassword.length >= 10) temp++;
    if (/[a-z]/.test(newPassword)) temp++;
    if (/[A-Z]/.test(newPassword)) temp++;
    if (/\d/.test(newPassword)) temp++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) temp++;

    if (temp < 5) {
      setMessage(
        "Password must be at least 10 characters long and include uppercase, lowercase, numbers, and special characters"
      );
      setMessageType("error");
      return;
    }

    try {
      console.log("Updating password for email:", password, newPassword);
      console.log(`${config.API_URL}/api/profile/updatePassword/${email}`);
      const response = await axios.patch(
        `${config.API_URL}/api/profile/updatePassword/${email}`,
        {
          oldPassword: password,
          newPassword: newPassword,
        }
      );

      setMessage(response.data.message);
      setMessageType("success");
      setPassword("");
      setNewPassword("");
      setTimeout(() => {
        navigation.navigate("UserProfile");
      }, 2000); // 2000ms = 2 seconds
    } catch (error) {
      console.log("Error updating password:", error);
      setMessage(error.response?.data?.message || "An error occurred");
      setMessageType("error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.statusSpacer} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Update Details</Text>

        {/* Message Display */}
        {message ? (
          <View
            style={[
              styles.messageBox,
              messageType === "error" ? styles.errorBox : styles.successBox,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                messageType === "error" ? styles.errorText : styles.successText,
              ]}
            >
              {message}
            </Text>
          </View>
        ) : null}

        {/* Display Email Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Email</Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* Update Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter new name"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateName}>
            <Text style={styles.buttonText}>Update Name</Text>
          </TouchableOpacity>
        </View>

        {/* Update Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Current password"
            placeholderTextColor={"black"}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor={"black"}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdatePassword}
          >
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.backButtonText]}>
            Back to Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  statusSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 12,
  },
  scrollViewContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 20,
    textAlign: "center",
  },
  messageBox: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: "#ffebee",
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  successBox: {
    backgroundColor: "#e8f5e9",
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  messageText: {
    fontSize: 14,
  },
  errorText: {
    color: "#dc3545",
  },
  successText: {
    color: "#28a745",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "#fff",
  },
});

export default UpdateDetails;
