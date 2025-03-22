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
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../styles/CustomInput';
import CustomButton from '../styles/CustomButton';
import { commonStyles } from '../styles/commonStyleSheet';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with:', email, password);
    {/* Add backend stuff here to help login */}
  };

  return (
    <View style={[commonStyles.container, styles.loginContainer]}>
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
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          
        </TouchableOpacity>
        {/*need to add the jwt logic here to resend email and verify again i think we can just take it to that page?? */}
        
        <CustomButton title="Login" onPress={handleLogin} />
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/Authentication/SignUp">Sign Up</Link>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 14,
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
  signUpLink: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Login;