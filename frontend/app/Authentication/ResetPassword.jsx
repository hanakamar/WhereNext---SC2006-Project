
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { commonStyles } from '../styles/commonStyleSheet';
import { useRouter } from 'expo-router';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const validations = [
      {
        test: newPassword.length >= 10,
        message: 'Password must be at least 10 characters long.',
      },
      {
        test: /[a-z]/.test(newPassword),
        message: 'Include at least one lowercase letter.',
      },
      {
        test: /[A-Z]/.test(newPassword),
        message: 'Include at least one uppercase letter.',
      },
      {
        test: /\d/.test(newPassword),
        message: 'Include at least one number.',
      },
      {
        test: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        message: 'Include at least one special character.',
      },
    ];

    const failed = validations.filter(rule => !rule.test).map(rule => rule.message);

    if (failed.length > 0) {
      Alert.alert('Weak Password', failed.join('\n'));
      return;
    }

    Alert.alert('Success', 'Your password has been reset!');
    router.push('/Authentication/Login');
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your new secure password</Text>

      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#007BFF', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResetPassword;
