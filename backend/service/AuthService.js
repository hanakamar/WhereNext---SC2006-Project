// AuthService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";

// Function to store JWT token
export const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
    } catch (error) {
        console.error('Error storing token:', error);
    }
};

// Function to retrieve JWT token
export const retrieveToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

// Function to decode JWT token
export const decodeToken = (token) => {
    try {
        return jwt_decode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
