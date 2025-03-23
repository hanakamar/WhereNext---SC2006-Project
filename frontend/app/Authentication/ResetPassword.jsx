import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { commonStyles } from '../styles/commonStyleSheet';
import { useRouter } from 'expo-router';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const router = useRouter();

  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Both password fields are required.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    // Password strength check
    let strength = 0;
    if (newPassword.length >= 10) strength++;
    if (/[a-z]/.test(newPassword)) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/\d/.test(newPassword)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) strength++;

    if (strength < 5) {
      setMessage('Password too weak. Use 10+ chars with upper, lower, number, and symbol.');
      setMessageType('error');
      return;
    }

    setMessage('Password updated successfully!');
    setMessageType('success');

    setTimeout(() => {
      router.push('/Authentication/Login');
    }, 1000);
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your new password</Text>

      <View style={styles.form}>
        <CustomInput
          placeholder="New Password"
          value={newPassword}
          setValue={setNewPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          secureTextEntry
        />
        <CustomButton title="Update Password" onPress={handleReset} />
      </View>

      {message !== '' && (
        <View style={[styles.messageBox, messageType === 'error' ? styles.error : styles.success]}>
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
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    maxWidth: 400,
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

export default ResetPassword;
