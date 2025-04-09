import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@env"; // Ensure you have this in your .env file
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import SharedData from "../SharedData";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native"; 
import { useFocusEffect } from "@react-navigation/native";
// ... (same imports as before)

const DailyPlanner = ({ navigation, userLocation }) => {
  const [plans, setPlans] = useState([]);
  const savedPlaces = SharedData.getSavedPlaces() || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanTime, setNewPlanTime] = useState(new Date());
  const [newPlanPlace, setNewPlanPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localSavedPlaces, setLocalSavedPlaces] = useState([]);
  const [email, setEmail] = useState("");
  const [showPdfDateModal, setShowPdfDateModal] = useState(false);
  const [pdfDate, setPdfDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      const userEmail = await AsyncStorage.getItem("userEmail");
      setEmail(userEmail);
      setIsLoggedIn(loginStatus === "true");
    };
    checkLoginStatus();
  }, []);
  
  const fetchSavedPlaces = async (userEmail) => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/saved`, {
        params: { email: userEmail },
      });
      const saved = res.data.savedPlaces || [];
      SharedData.setSavedPlaces(saved);
      setLocalSavedPlaces(saved);
      console.log("✅ Saved places fetched:", saved.length);
    } catch (err) {
      console.error("❌ Failed to load saved places:", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkAndFetch = async () => {
        const loginStatus = await AsyncStorage.getItem("isLoggedIn");
        const userEmail = await AsyncStorage.getItem("userEmail");
        setEmail(userEmail);
        setIsLoggedIn(loginStatus === "true");
  
        if (loginStatus === "true" && userEmail) {
          fetchSavedPlaces(userEmail); // pass email directly
        }
      };
  
      checkAndFetch();
  
      const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
      const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
  
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, [])
  );

  const searchPlaces = async (query) => {
    if (query.length <= 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    console.log("🔍 Searching in:", localSavedPlaces);
    const matchedSavedPlaces = localSavedPlaces.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(matchedSavedPlaces);
    setIsSearching(false);
  };

  const addPlan = () => {
    if (!newPlanTitle.trim() || !newPlanPlace) return;

    const newPlan = {
      id: Date.now().toString(),
      title: newPlanTitle,
      time: newPlanTime.getTime(),
      place: {
        ...newPlanPlace,
        
      },
    };

    setPlans([...plans, newPlan]);
    setShowAddModal(false);
    resetNewPlanForm();

    // Here you would save to AsyncStorage
  };
  const handleRefresh = () => {
    fetchSavedPlaces();
  };


  const resetNewPlanForm = () => {
    setNewPlanTitle("");
    setNewPlanTime(new Date());
    setNewPlanPlace(null);
    setSearchQuery("");
    setSearchResults([]);
  };
  const generateItineraryText = () => {
    if (plans.length === 0) return "No plans yet.";

    return plans
      .sort((a, b) => a.time - b.time)
      .map((plan, index) => {
        const time = format(new Date(plan.time), "h:mm a");
        const title = plan.title;
        const name = plan.place?.name || "Custom Place";
        const address = plan.place?.address || "No address provided";

        return `${index + 1}. ${title} — ${time}
  📍 ${name}
  🏠 ${address}\n`;
      })
      .join("\n");
  };
  const copyItineraryToClipboard = () => {
    const text = generateItineraryText();
    Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "✅ Itinerary copied to clipboard.");
  };

  // const navigateToPlaceDetails = (place) => {
  //   // Navigate to the place detail screen in your existing app
  //   navigation.navigate("ViewLocation", { placeId: place.id });
  // };

  const removePlan = (planId) => {
    setPlans(plans.filter((plan) => plan.id !== planId));
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
        <Text style={styles.planTime}>
          {format(new Date(item.time), "h:mm a")}
        </Text>
      </View>

      <View style={styles.planContentContainer}>
        <TouchableOpacity>
          <Text style={styles.planTitle}>{item.title}</Text>
          <Text style={styles.placeName}>{item.place.name}</Text>
          <Text style={styles.placeAddress}>{item.place.address}</Text>
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

  const handleExportToPDF = () => {
    setShowPdfDateModal(true);
  };

  const generatePDF = async () => {
    const formattedPlans = plans
      .sort((a, b) => a.time - b.time)
      .map(
        (plan) => `
          <div style="margin-bottom: 10px;">
            <strong>${format(new Date(plan.time), "h:mm a")}:</strong> 
            <div>${plan.title} - ${plan.place.name}</div>
            <div style="font-size: 12px; color: gray;">${
              plan.place.address
            }</div>
          </div>
        `
      )
      .join("");
  
      const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              background-color: #f9f9f9;
              color: #222;
              font-size: 18px;
            }
            h1 {
              text-align: center;
              color: #007bff;
              margin-bottom: 32px;
              font-size: 26px;
            }
            .plan {
              background: #ffffff;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 20px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            }
            .time {
              font-weight: bold;
              font-size: 18px;
              color: #007bff;
              margin-bottom: 6px;
            }
            .title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 4px;
            }
            .place-name {
              font-size: 16px;
              color: #333;
              margin-bottom: 2px;
            }
            .address {
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <h1>🗓️ Daily Plan — ${format(pdfDate, "dd MMM yyyy")}</h1>
          ${plans
            .sort((a, b) => a.time - b.time)
            .map(
              (plan) => `
                <div class="plan">
                  <div class="time">🕒 ${format(new Date(plan.time), "h:mm a")}</div>
                  <div class="title">${plan.title}</div>
                  <div class="place-name">📍 ${plan.place.name}</div>
                  <div class="address">🏠 ${plan.place.address}</div>
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Sharing not supported on this device");
      }

      setShowPdfDateModal(false);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.headerTitle}>My Plan</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="#4a7cff" />
        </TouchableOpacity>
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
          keyExtractor={(item) => item.id}
          style={styles.planList}
          contentContainerStyle={styles.planListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View
          style={{
            position: "absolute",
            bottom: 24,
            left: 16,
            right: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Side: Copy + PDF buttons only if there are plans */}
          {plans.length > 0 ? (
            <View style={{ flexDirection: "row", gap: 6 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#007bff",
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                }}
                onPress={copyItineraryToClipboard}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                  Copy to Clipboard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#007bff",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
                onPress={handleExportToPDF}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
                  Generate a PDF
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}

          {/* Right Side: Add Button (always visible) */}
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#007bff",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 5,
            }}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
            
      <Modal
  visible={showPdfDateModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowPdfDateModal(false)}
>
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
    <View style={{ backgroundColor: "#fff", padding: 24, borderRadius: 12, width: "80%" }}>
      <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 12 }}>Choose Date for PDF</Text>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
        }}
        onPress={() => setShowPdfDateModal(false)}
      >
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: "#FFFFFF", // white background for contrast
          borderRadius: 12,
          padding: 16,
          alignItems: "center",
          marginBottom: 24,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#000000", // high contrast black text
            marginBottom: 12,
          }}
        >
          Select Date:
        </Text>

        <DateTimePicker
          value={pdfDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setPdfDate(selectedDate);
          }}
          themeVariant="light" // For consistent light theme on iOS
          style={{
            transform: [{ scale: 1.25 }],
          }}
        />
      </View>

      <TouchableOpacity
        onPress={generatePDF}
        style={{ backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center" }}
      >


        <Text style={{ color: "#fff", fontWeight: "600" }}>Generate PDF</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      {/* Add Plan Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              keyboardVisible && { maxHeight: "90%" },
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
                placeholderTextColor="#36454F"
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
                    {format(newPlanTime, "h")}
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
                    {format(newPlanTime, "mm")}
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
                      {format(newPlanTime, "a")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.inputLabel}>Place / Custom Activity</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    searchPlaces(text);
                  }}
                  placeholder="Search for a place / Custom Activity"
                  placeholderTextColor="#36454F"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                )}
              </View>

              {searchQuery.length > 0 && (
                <View style={styles.searchResultsContainer}>
                  {isSearching ? (
                    <Text style={styles.searchingText}>Searching...</Text>
                  ) : searchResults.length > 0 ? (
                    <ScrollView style={{ maxHeight: 180 }}>
                      {searchResults.map((item) => (
                        <View key={item.id}>
                          {renderSearchResultItem({ item })}
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.searchingText}>No results found</Text>
                  )}
                </View>
              )}

              {newPlanPlace && (
                <View style={styles.selectedPlaceContainer}>
                  <Text style={styles.selectedPlaceTitle}>
                    Selected Place / Acitivity:
                  </Text>
                  <Text style={styles.selectedPlaceName}>
                    {newPlanPlace.name}
                  </Text>
                  <Text style={styles.selectedPlaceAddress}>
                    {newPlanPlace.address}
                  </Text>
                </View>
              )}
              {searchQuery.trim() !== "" && !newPlanPlace && (
                <TouchableOpacity
                  style={styles.customOptionButton}
                  onPress={() => {
                    setNewPlanPlace({
                      id: `custom-${Date.now()}`,
                      name: searchQuery.trim(),
                      address: "",
                      isCustom: true,
                    });
                  }}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#007bff"
                  />
                  <Text style={styles.customOptionText}>
                    Use "{searchQuery.trim()}" without location
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.addPlanButton,
                  (!newPlanTitle.trim() || !newPlanPlace) &&
                    styles.addPlanButtonDisabled,
                ]}
                onPress={addPlan}
                disabled={!newPlanTitle.trim() || !newPlanPlace}
              >
                <Text style={styles.addPlanButtonText}>Save Plan</Text>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#4A4A4A",
    marginTop: 8,
  },
  planList: {
    flex: 1,
  },
  planListContent: {
    padding: 16,
  },
  planItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  planTimeContainer: {
    width: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  planTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
  },
  planContentContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  placeName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555555",
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center", // center it horizontally
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginBottom: 12,
  },
  shareButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },

  customOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#EAF2FF",
    borderRadius: 8,
    marginBottom: 12,
  },
  customOptionText: {
    color: "#007bff",
    fontWeight: "500",
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#666666",
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333333",
  },
  // Time picker styles - ENHANCED
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  timePickerColumn: {
    alignItems: "center",
    marginHorizontal: 10,
    minWidth: 40,
  },
  timeAdjustButton: {
    padding: 10,
    backgroundColor: "#E8E8E8",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  timeDisplayText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333333",
    marginVertical: 8,
    minWidth: 40,
    textAlign: "center",
  },
  timeColon: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333333",
    marginHorizontal: 4,
  },
  ampmButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    minWidth: 60,
    alignItems: "center",
  },
  ampmText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333333",
    paddingRight: 40,
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  searchingText: {
    padding: 12,
    color: "#888888",
    textAlign: "center",
  },
  searchResultsContainer: {
    backgroundColor: "#F5F5F5",
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
    borderBottomColor: "#EEEEEE",
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3007bff",
    marginBottom: 2,
  },
  searchResultAddress: {
    fontSize: 12,
    color: "#33333",
  },
  selectedPlaceContainer: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#007bff",
  },
  selectedPlaceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 4,
  },
  selectedPlaceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 2,
  },
  selectedPlaceAddress: {
    fontSize: 12,
    color: "#666666",
  },
  addPlanButton: {
    backgroundColor: "#3898FF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  addPlanButtonDisabled: {
    backgroundColor: "rgb(236, 236, 236)",
  },
  addPlanButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DailyPlanner;
