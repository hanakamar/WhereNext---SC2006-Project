import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../styles/CustomInput';
import CustomButton from '../styles/CustomButton';
import { commonStyles } from '../styles/commonStyleSheet';

const Welcome = ({ navigation }) => {
  return (
    <View style={[commonStyles.container, styles.welcomeContainer]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>WhereNext</Text>
        <Text style={styles.tagline}>Plan and visualize your day</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[commonStyles.button, styles.button]} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.button, styles.button, styles.signUpButton]} 
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={[commonStyles.buttonText, styles.signUpText]}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  signUpText: {
    color: '#007BFF',
  },
  skipButton: {
    padding: 10,
    alignItems: 'center',
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
});

export default Welcome;