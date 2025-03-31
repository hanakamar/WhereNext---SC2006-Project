/*
 { View, Text } from "react-native";
export default function Login() {
  return (
    <View>
      <Text>Login Page</Text>
    </View>
  );
}
*/
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { commonStyles } from "../styles/commonStyleSheet";
import { Link, useRouter } from "expo-router";
import config from "../../config";
import axios from "axios";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    console.log("Logging in with:", email);
    console.log(`${config.API_URL}/api/profile/login`);

    const userData = {
      email: email,
      password: password,
    };

    const handleNavigate = () => {
      navigation.navigate("Main"); // Navigate to the main app
    };

    /* Add backend stuff here to help login */
    try {
      const res = await axios.post(
        `${config.API_URL}/api/profile/login`,
        userData
      );
      if (res.data.status === "ok") {
        Alert.alert("Login Successful");
        console.log("Login Successful");
        navigation.navigate("Main"); // Navigate to the main app
      } else {
        Alert.alert("Login Failed", res.data.message || "Unexpected error");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  return (
    <View style={[commonStyles.container, styles.loginContainer]}>
      <BackButton />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.formContainer}>
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

        <TouchableOpacity style={styles.forgotPassword}>
          {/*<Text style={styles.forgotPasswordText}>Forgot Password?</Text> */}
          <Link
            href="/Authentication/ForgotPassword"
            style={styles.forgotPasswordText}
          >
            Forgot Password?
          </Link>
        </TouchableOpacity>
        {/*need to add the jwt logic here to resend email and verify again i think we can just take it to that page?? */}

        <CustomButton title="Login" onPress={handleLogin} />
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="./SignUp" style={styles.signUpLink}>
          Sign Up
        </Link>
        {/*<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 40,
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
    alignSelf: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
    maxWidth: 400,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 14,
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
  signUpLink: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Login;
