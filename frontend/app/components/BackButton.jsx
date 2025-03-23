import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const BackButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.back}>
      <Text style={styles.text}>← Back</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  text: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default BackButton;
