import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const UpdateDetails = () => {
  const router = useRouter();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleUpdateName = () => {
    if (!name.trim()) {
      setMessage('Name cannot be empty');
      setMessageType('error');
      return;
    }
    setMessage('Name updated successfully');
    setMessageType('success');
  };

  const handleUpdateEmail = () => {
    if (!email.trim()) {
      setMessage('Email cannot be empty');
      setMessageType('error');
      return;
    }
    if (!email.includes('@')) {
      setMessage('Please enter a valid email');
      setMessageType('error');
      return;
    }
    setShowVerification(true);
    setMessage('Verification code sent to your email');
    setMessageType('success');
  };

  const handleVerifyEmail = () => {
    if (!verificationCode.trim()) {
      setMessage('Please enter verification code');
      setMessageType('error');
      return;
    }
    if (verificationCode === '123456') { // Dummy verification code
      setMessage('Email updated successfully');
      setMessageType('success');
      setShowVerification(false);
    } else {
      setMessage('Invalid verification code');
      setMessageType('error');
    }
  };

  const handleUpdatePassword = () => {
    if (!password || !newPassword) {
      setMessage('Please fill in all password fields');
      setMessageType('error');
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
      setMessage('Password must be at least 10 characters long and include uppercase, lowercase, numbers, and special characters');
      setMessageType('error');
      return;
    }

    setMessage('Password updated successfully');
    setMessageType('success');
    setPassword('');
    setNewPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Details</Text>

      {/* Message Display */}
      {message ? (
        <View style={[styles.messageBox, messageType === 'error' ? styles.errorBox : styles.successBox]}>
          <Text style={[styles.messageText, messageType === 'error' ? styles.errorText : styles.successText]}>
            {message}
          </Text>
        </View>
      ) : null}

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

      {/* Update Email Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter new email"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
          <Text style={styles.buttonText}>Update Email</Text>
        </TouchableOpacity>

        {showVerification && (
          <View style={styles.verificationSection}>
            <TextInput
              style={styles.input}
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Enter verification code"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyEmail}>
              <Text style={styles.buttonText}>Verify Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Update Password Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Current password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={[styles.buttonText, styles.backButtonText]}>Back to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageBox: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  messageText: {
    fontSize: 14,
  },
  errorText: {
    color: '#dc3545',
  },
  successText: {
    color: '#28a745',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verificationSection: {
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
  },
});

export default UpdateDetails; 