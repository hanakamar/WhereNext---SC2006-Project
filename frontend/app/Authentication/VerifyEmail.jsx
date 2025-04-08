import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { commonStyles } from "../styles/commonStyleSheet";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

const VerifyEmail = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null);
  const router = useRouter();
  const route = useRoute(); // Get the route object
  const { from } = route.params || {}; // Get the 'from' parameter from the route

  const clearMessage = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType(null);
    }, 3000);
  };

  const handleVerify = () => {
    if (code.trim() === "") {
      setMessage("Verification code is required.");
      setMessageType("error");
      clearMessage();
    } else if (code === "123456") {
      setMessage("Verification successful!");
      setMessageType("success");
      clearMessage();
      setTimeout(() => {
        if (from !== "ForgotPassword") {
          navigation.navigate("Login");
        } else {
          navigation.navigate("ResetPassword");
        }
      }, 1000);
    } else {
      setMessage("Incorrect verification code.");
      setMessageType("error");
      clearMessage();
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <BackButton />
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your email
      </Text>

      <View style={styles.form}>
        <CustomInput
          placeholder="Enter Verification Code"
          value={code}
          setValue={setCode}
        />
        <CustomButton title="Verify Code" onPress={handleVerify} />
      </View>

      {message !== "" && (
        <View
          style={[
            styles.messageBox,
            messageType === "error" ? styles.error : styles.success,
          ]}
        >
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  messageBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  error: {
    backgroundColor: "#ffe6e6",
    borderLeftWidth: 4,
    borderLeftColor: "#ff4d4d",
  },
  success: {
    backgroundColor: "#e6f9ec",
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  messageText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
  },
});

export default VerifyEmail;
