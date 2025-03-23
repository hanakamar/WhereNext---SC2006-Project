/*
import { View, Text } from "react-native";
export default function Signup() {
  return (
    <View>
      <Text>Signup Page</Text>
    </View>
  );
}
*/
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../styles/CustomInput';
import CustomButton from '../styles/CustomButton';
import { commonStyles } from '../styles/commonStyleSheet';
import { Link } from 'expo-router';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null);

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    // Password strength validation
    let strength = 0;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength < 5) {
      setMessage('Password too weak. Use at least 10 characters with uppercase, lowercase, number, and symbol.');
      setMessageType('error');
      return;
    }
    else{
      setMessage('Account created successfully!');
      setMessageType('success');
    }
    

    console.log('Signing up with:', { name, email, password });
    {/* Add backend authentication logic here */}
    

  };

  return (
    <View style={[commonStyles.container, styles.signUpContainer]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join WhereNext today</Text>
      </View>

      <View style={styles.formContainer}>
        <CustomInput 
          placeholder="Full Name" 
          value={name} 
          setValue={setName}
        />
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
      {message !== '' && (
        <View style={[styles.messageBox, messageType === 'error' ? styles.error : styles.success]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/Authentication/Login" style={styles.loginLink}>Login</Link>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signUpContainer: {
    padding: 20,
    flex:1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
    maxWidth: 400,
    alignSelf : 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  messageBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  error: {
    backgroundColor: '#ffe6e6',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4d4d',
  },
  success: {
    backgroundColor: '#e6f9ec',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  messageText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  
});

export default SignUp;