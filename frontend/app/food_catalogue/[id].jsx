import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Extract all params
  const {
    id,
    name,
    address,
    image,
    description,
    distance,
    popularity,
    backRoute = '/screens/catalogue',
  } = params;

  // Convert popularity from string back to number for calculations
  const numPopularity = popularity ? parseFloat(popularity) : 4.0;
  // Convert distance from string back to number if needed
  const numDistance = distance ? parseFloat(distance) : 0;

  const handleGoBack = () => {
    router.push(backRoute);
  };

  const handleOpenMap = () => {
    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(mapUrl);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4a7cff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Restaurant Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Restaurant Image */}
        <Image source={{ uri: image }} style={styles.image} />

        {/* Restaurant Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFC107" />
            <Text style={styles.rating}>{numPopularity.toFixed(1)}</Text>
          </View>

          <View style={styles.addressContainer}>
            <Ionicons name="location" size={18} color="#FF5252" />
            <Text style={styles.address}>{address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={18} color="#4a7cff" />
            <Text style={styles.infoText}>{description || 'Restaurant'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="navigate" size={18} color="#4CAF50" />
            <Text style={styles.infoText}>{numDistance} km from your location</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenMap}>
            <Ionicons name="map" size={22} color="white" />
            <Text style={styles.actionText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info Section */}
        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {`${name} is located ${numDistance} km from your current location. This ${description?.toLowerCase() || 'restaurant'} is rated ${numPopularity.toFixed(1)} stars by customers.`}
          </Text>

          <Text style={styles.sectionTitle}>Hours</Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hourRow}>
              <Text style={styles.day}>Monday - Friday</Text>
              <Text style={styles.time}>9:00 AM - 10:00 PM</Text>
            </View>
            <View style={styles.hourRow}>
              <Text style={styles.day}>Saturday - Sunday</Text>
              <Text style={styles.time}>10:00 AM - 11:00 PM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  actionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    backgroundColor: '#4a7cff',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  additionalInfo: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  hoursContainer: {
    marginBottom: 16,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  day: {
    fontSize: 14,
    color: '#555',
  },
  time: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
});