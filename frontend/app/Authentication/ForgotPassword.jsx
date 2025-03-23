import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { commonStyles } from '../styles/commonStyleSheet';
import { Link, useRouter } from 'expo-router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // email sent/ not sent 
  const [messageType, setMessageType] = useState(null); // sucess -> green if not error-> red
  const router = useRouter();

  const handleSendResetLink = async() => {
    console.log('Sending password reset link to:', email);
    // Add backend stuff here same as initial jwt code used during signup i think?
    if (email==='') {
      setMessage('Email field is compulsory');
      setMessageType('error');
      return;
    }
    else if (!email.endsWith('@gmail.com')) {
      setMessage('Email is not registered');
      setMessageType('error');
      return;
    }
    
    setMessage('Verification email sent!');
    setMessageType('success');

    // goes to verifyemail after a short delay 1000ms or 1 second
    setTimeout(() => {
      router.push('/Authentication/VerifyEmail');
    }, 1000);
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>
      </View>

      <View style={styles.formContainer}>
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
        />
        <CustomButton title="Send Reset Link" onPress={handleSendResetLink} />
      </View>

      
      {message !== '' && (
        <View
          style={[
            styles.messageBox,
            messageType === 'error' ? styles.error : styles.success,
          ]}
        >
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}


      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Remembered your password? </Text>
        <Link href="/Authentication/Login">
          <Text style={styles.loginLink}>Login</Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 20,
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
    borderRadius: 8,
  },
  error: {
    backgroundColor: '#ffe6e6',
  },
  success: {
    backgroundColor: '#e6f9ec',
  },
  messageText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },

});

export default ForgotPassword;
