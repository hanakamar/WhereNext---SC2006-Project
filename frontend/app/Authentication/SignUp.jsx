import axios from "axios";
import config from "../../config";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { commonStyles } from "../styles/commonStyleSheet";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null);

  const clearMessage = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType(null);
    }, 3000);
  };

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      setMessage("All fields are required.");
      setMessageType("error");
      clearMessage();
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      clearMessage();
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      clearMessage();
      return;
    }

    let strength = 0;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength < 5) {
      setMessage(
        "Password too weak. Use at least 10 characters with uppercase, lowercase, number, and symbol."
      );
      setMessageType("error");
      clearMessage();
      return;
    }

    const userData = {
      email,
      password,
      name,
      country: "Singapore",
    };

    axios
      .post(`${config.API_URL}/api/profile/signup`, userData)
      .then((res) => {
        if (res.data.status === "ok") {
          Alert.alert("Success", "Registered Successfully", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("VerifyEmail"), { from: "SignUp" };
              },
            },
          ]);
        } else {
          Alert.alert("Error", res.data.message || "Unexpected error");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert(
              "Error",
              error.response.data.message || "All fields must be filled"
            );
          } else if (error.response.status === 409) {
            Alert.alert(
              "Error",
              error.response.data.message || "Username or name already in use"
            );
          } else {
            Alert.alert("Error", error.message);
          }
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  return (
    <View style={[commonStyles.container, styles.signUpContainer]}>
      <BackButton />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join WhereNext today</Text>
      </View>

      <View style={styles.formContainer}>
        <CustomInput placeholder="Full Name" value={name} setValue={setName} />
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          secureTextEntry
        />

        <CustomButton title="Sign Up" onPress={handleSignUp} />
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

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signUpContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
    maxWidth: 400,
    alignSelf: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
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

export default SignUp;
