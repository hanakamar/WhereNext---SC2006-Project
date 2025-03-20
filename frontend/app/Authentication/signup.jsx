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

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signing up with:', { name, email, password });
    // Add authentication logic here
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

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signUpContainer: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
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
  },
});

export default SignUp;