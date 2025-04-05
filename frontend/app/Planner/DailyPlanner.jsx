import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Modal, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const DailyPlanner = ({ savedPlaces, navigation, userLocation }) => {
  const [plans, setPlans] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanTime, setNewPlanTime] = useState(new Date());
  const [newPlanPlace, setNewPlanPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Load plans for current date from storage (implement with AsyncStorage)
    loadPlansForDate(currentDate);
    
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
  }, [currentDate]);

  // Rest of your existing functions...
  
  // [Include all your existing functions here]
  const loadPlansForDate = async (date) => {
    // Here you would fetch plans from AsyncStorage
    // For now, we'll use dummy data
    const dummyPlans = [
      {
        id: '1',
        title: 'Lunch',
        time: new Date(date).setHours(12, 30),
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
        time: new Date(date).setHours(19, 0),
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
        <TouchableOpacity
          style={styles.dateNavButton}
          onPress={() => {
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            setCurrentDate(prevDate);
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#007bff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateDisplay}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{format(currentDate, 'EEEE, MMMM d')}</Text>
          <Ionicons name="calendar" size={20} color="#007bff" style={styles.calendarIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateNavButton}
          onPress={() => {
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setCurrentDate(nextDate);
          }}
        >
          <Ionicons name="chevron-forward" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {plans.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#007bff" />
          <Text style={styles.emptyStateText}>No plans for this day</Text>
          <Text style={styles.emptyStateSubtext}>Tap + to add your first plan</Text>
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

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setCurrentDate(selectedDate);
            }
          }}
        />
      )}

      {/* Add Plan Modal - Updated with KeyboardAvoidingView */}
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
              <Text style={styles.modalTitle}>Add New Plan</Text>
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
              <TouchableOpacity
                style={styles.timeSelector}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.timeText}>
                  {format(newPlanTime, 'h:mm a')}
                </Text>
                <Ionicons name="time-outline" size={20} color="#007bff" />
              </TouchableOpacity>

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
                <Text style={styles.addPlanButtonText}>Add to Plan</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateNavButton: {
    padding: 8,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  calendarIcon: {
    marginLeft: 4,
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
  timeSelector: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#333333',
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