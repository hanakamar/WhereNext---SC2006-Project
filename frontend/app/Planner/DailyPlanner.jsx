import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Modal, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const DailyPlanner = ({ savedPlaces, navigation, userLocation }) => {
  const [plans, setPlans] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanTime, setNewPlanTime] = useState(new Date());
  const [newPlanPlace, setNewPlanPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Load saved plans (implement with AsyncStorage)
    loadSavedPlans();
    
    // Set up keyboard listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    // Clean up listeners
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const loadSavedPlans = async () => {
    // Here you would fetch plans from AsyncStorage
    // For now, we'll use dummy data
    const dummyPlans = [
      {
        id: '1',
        title: 'Lunch',
        time: new Date().setHours(12, 30),
        place: {
          id: 'place1',
          name: 'Bistro Cafe',
          address: '123 Main St',
          isOpen: true,
        },
      },
      {
        id: '2',
        title: 'Movie Night',
        time: new Date().setHours(19, 0),
        place: {
          id: 'place2',
          name: 'Grand Cinema',
          address: '456 Park Ave',
          isOpen: true,
        },
      },
    ];
    setPlans(dummyPlans);
  };

  const searchPlaces = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Here you would call your Google Places API
    // For demo, we'll use a mix of saved places and dummy data

    const matchedSavedPlaces = savedPlaces
      ? savedPlaces.filter(place =>
          place.name.toLowerCase().includes(query.toLowerCase()))
      : [];

    // Simulating API call delay
    setTimeout(() => {
      const dummyApiResults = [
        { id: 'g1', name: 'Green Park Restaurant', address: '789 Green St', isOpen: checkIfOpen(18, 22) },
        { id: 'g2', name: 'Blue Harbor Cafe', address: '101 Ocean Blvd', isOpen: checkIfOpen(7, 16) },
        { id: 'g3', name: 'Mountain View Hotel', address: '202 Hill Rd', isOpen: checkIfOpen(0, 24) },
      ].filter(place => place.name.toLowerCase().includes(query.toLowerCase()));

      setSearchResults([...matchedSavedPlaces, ...dummyApiResults]);
      setIsSearching(false);
    }, 300);
  };

  const checkIfOpen = (openHour, closeHour) => {
    // This is a placeholder. In a real implementation, you would:
    // 1. Use the Google Places API to get actual opening hours
    // 2. Compare with the planned time to determine if open
    const currentHour = new Date().getHours();
    return currentHour >= openHour && currentHour < closeHour;
  };

  const addPlan = () => {
    if (!newPlanTitle.trim() || !newPlanPlace) return;

    const newPlan = {
      id: Date.now().toString(),
      title: newPlanTitle,
      time: newPlanTime.getTime(),
      place: {
        ...newPlanPlace,
        isOpen: checkIfOpenAtTime(newPlanPlace, newPlanTime), // Check if open at planned time
      },
    };

    setPlans([...plans, newPlan]);
    setShowAddModal(false);
    resetNewPlanForm();

    // Here you would save to AsyncStorage
  };

  const checkIfOpenAtTime = (place, time) => {
    // This would be implemented with actual opening hours data
    // For demo, we'll return a reasonable assumption
    const hour = time.getHours();
    return hour >= 8 && hour <= 22; // Assuming most places open 8am-10pm
  };

  const resetNewPlanForm = () => {
    setNewPlanTitle('');
    setNewPlanTime(new Date());
    setNewPlanPlace(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const navigateToPlaceDetails = (place) => {
    // Navigate to the place detail screen in your existing app
    navigation.navigate('PlaceDetails', { placeId: place.id });
  };

  const removePlan = (planId) => {
    setPlans(plans.filter(plan => plan.id !== planId));
    // Here you would also remove from AsyncStorage
  };

  // Time adjustment functions - UPDATED for better handling
  const adjustHour = (increment) => {
    const newTime = new Date(newPlanTime);
    const currentHour = newTime.getHours();
    let newHour = currentHour + increment;
    
    // Handle hour wrapping correctly
    if (newHour < 0) newHour = 23;
    if (newHour > 23) newHour = 0;
    
    newTime.setHours(newHour);
    setNewPlanTime(newTime);
  };

  const adjustMinute = (increment) => {
    const newTime = new Date(newPlanTime);
    const currentMinute = newTime.getMinutes();
    let newMinute = currentMinute + increment;
    
    // Handle minute wrapping correctly
    if (newMinute < 0) {
      newMinute = 55; // Wrap to 55 minutes when going below 0
      adjustHour(-1); // Decrement hour
    } else if (newMinute > 59) {
      newMinute = 0; // Wrap to 0 minutes when exceeding 59
      adjustHour(1); // Increment hour
    }
    
    newTime.setMinutes(newMinute);
    setNewPlanTime(newTime);
  };

  const toggleAMPM = () => {
    const newTime = new Date(newPlanTime);
    const currentHour = newTime.getHours();
    
    if (currentHour < 12) {
      // Switch to PM (add 12 hours)
      newTime.setHours(currentHour + 12);
    } else {
      // Switch to AM (subtract 12 hours)
      newTime.setHours(currentHour - 12);
    }
    
    setNewPlanTime(newTime);
  };

  const renderPlanItem = ({ item }) => (
    <View style={styles.planItem}>
      <View style={styles.planTimeContainer}>
        <Text style={styles.planTime}>{format(new Date(item.time), 'h:mm a')}</Text>
      </View>

      <View style={styles.planContentContainer}>
        <TouchableOpacity onPress={() => navigateToPlaceDetails(item.place)}>
          <Text style={styles.planTitle}>{item.title}</Text>
          <Text style={styles.placeName}>{item.place.name}</Text>
          <Text style={styles.placeAddress}>{item.place.address}</Text>

          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: item.place.isOpen ? '#4CAF50' : '#F44336' }]} />
            <Text style={styles.statusText}>
              {item.place.isOpen ? 'Open at this time' : 'Closed at this time'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePlan(item.id)}
      >
        <Ionicons name="close-circle" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const renderSearchResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => {
        setNewPlanPlace(item);
        setSearchQuery(item.name);
        setSearchResults([]);
        Keyboard.dismiss();
      }}
    >
      <Text style={styles.searchResultName}>{item.name}</Text>
      <Text style={styles.searchResultAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Plan</Text>
      </View>

      {plans.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#007bff" />
          <Text style={styles.emptyStateText}>No places saved</Text>
          <Text style={styles.emptyStateSubtext}>Tap + to add a new place</Text>
        </View>
      ) : (
        <FlatList
          data={plans.sort((a, b) => a.time - b.time)}
          renderItem={renderPlanItem}
          keyExtractor={item => item.id}
          style={styles.planList}
          contentContainerStyle={styles.planListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Plan Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View 
            style={[
              styles.modalContent,
              keyboardVisible && { maxHeight: '90%' }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Place</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  resetNewPlanForm();
                }}
              >
                <Ionicons name="close" size={24} color="#007bff" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={newPlanTitle}
                onChangeText={setNewPlanTitle}
                placeholder="What are you planning?"
                placeholderTextColor="#A0A0A0"
              />

              <Text style={styles.inputLabel}>Time</Text>
              <View style={styles.timePickerContainer}>
                {/* Hour controls */}
                <View style={styles.timePickerColumn}>
                  <TouchableOpacity 
                    style={styles.timeAdjustButton}
                    onPress={() => adjustHour(1)}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="chevron-up" size={24} color="#007bff" />
                  </TouchableOpacity>
                  
                  <Text style={styles.timeDisplayText}>
                    {format(newPlanTime, 'h')}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.timeAdjustButton}
                    onPress={() => adjustHour(-1)}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="chevron-down" size={24} color="#007bff" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.timeColon}>:</Text>
                
                {/* Minute controls */}
                <View style={styles.timePickerColumn}>
                  <TouchableOpacity 
                    style={styles.timeAdjustButton}
                    onPress={() => adjustMinute(5)}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="chevron-up" size={24} color="#007bff" />
                  </TouchableOpacity>
                  
                  <Text style={styles.timeDisplayText}>
                    {format(newPlanTime, 'mm')}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.timeAdjustButton}
                    onPress={() => adjustMinute(-5)}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="chevron-down" size={24} color="#007bff" />
                  </TouchableOpacity>
                </View>
                
                {/* AM/PM toggle */}
                <View style={styles.timePickerColumn}>
                  <TouchableOpacity 
                    style={styles.ampmButton}
                    onPress={toggleAMPM}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.ampmText}>
                      {format(newPlanTime, 'a')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.inputLabel}>Place</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    searchPlaces(text);
                  }}
                  placeholder="Search for a place"
                  placeholderTextColor="#A0A0A0"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                )}
              </View>

              {isSearching ? (
                <Text style={styles.searchingText}>Searching...</Text>
              ) : (
                searchResults.length > 0 && (
                  <View style={styles.searchResultsContainer}>
                    <FlatList
                      data={searchResults}
                      renderItem={renderSearchResultItem}
                      keyExtractor={item => item.id}
                      nestedScrollEnabled={true}
                      style={styles.searchResultsList}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                )
              )}

              {newPlanPlace && (
                <View style={styles.selectedPlaceContainer}>
                  <Text style={styles.selectedPlaceTitle}>Selected Place:</Text>
                  <Text style={styles.selectedPlaceName}>{newPlanPlace.name}</Text>
                  <Text style={styles.selectedPlaceAddress}>{newPlanPlace.address}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.addPlanButton,
                  (!newPlanTitle.trim() || !newPlanPlace) && styles.addPlanButtonDisabled
                ]}
                onPress={addPlan}
                disabled={!newPlanTitle.trim() || !newPlanPlace}
              >
                <Text style={styles.addPlanButtonText}>Save Place</Text>
              </TouchableOpacity>
              
              {/* Add some extra padding at the bottom when keyboard is visible */}
              {keyboardVisible && <View style={{ height: 80 }} />}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888888',
    marginTop: 8,
  },
  planList: {
    flex: 1,
  },
  planListContent: {
    padding: 16,
  },
  planItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  planTimeContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  planTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  planContentContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666666',
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
  },
  // Time picker styles - ENHANCED
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  timePickerColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
    minWidth: 40,
  },
  timeAdjustButton: {
    padding: 10,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  timeDisplayText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333333',
    marginVertical: 8,
    minWidth: 40,
    textAlign: 'center',
  },
  timeColon: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 4,
  },
  ampmButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  ampmText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  searchingText: {
    padding: 12,
    color: '#888888',
    textAlign: 'center',
  },
  searchResultsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    maxHeight: 200,
    marginBottom: 16,
  },
  searchResultsList: {
    borderRadius: 8,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  searchResultAddress: {
    fontSize: 12,
    color: '#888888',
  },
  selectedPlaceContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  selectedPlaceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 4,
  },
  selectedPlaceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  selectedPlaceAddress: {
    fontSize: 12,
    color: '#666666',
  },
  addPlanButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addPlanButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  addPlanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DailyPlanner;