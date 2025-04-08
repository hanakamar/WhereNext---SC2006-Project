// app/planner.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const isValidTimeFormat = (time) => /^\d{1,2}:\d{2} (AM|PM)$/i.test(time);

const isTimeSlotAvailable = (planner, index, time) => {
  if (!time) return true; // Empty time is always available
  return !planner.some((item, i) => i !== index && item.time && item.time.toLowerCase() === time.toLowerCase());
};

export default function Planner() {
  const { item } = useLocalSearchParams();
  const [planner, setPlanner] = useState([]);
  const router = useRouter();
  const [timeSlots] = useState([
    { time: "9:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "1:00 PM", available: true },
    { time: "3:00 PM", available: true },
  ]);

  useEffect(() => {
    if (item) {
      addToPlanner({ name: item });
    }
  }, [item]);

  const addToPlanner = (newItem) => {
    setPlanner((prev) => [...prev, { ...newItem, time: "" }]);
  };

  const assignTimeSlot = (index, time) => {
    const updatedPlanner = [...planner];
    if (index >= 0 && index < updatedPlanner.length) {
      if (isValidTimeFormat(time) || time === "") { // Allows empty string
        if (isTimeSlotAvailable(updatedPlanner, index, time)) {
          updatedPlanner[index].time = time;
          setPlanner(updatedPlanner);
          return { success: true };
        } else {
          return { success: false, error: 'Time slot not available' };
        }
      } else {
        return { success: false, error: 'Invalid time format (e.g., 9:00 AM)' };
      }
    } else {
      return { success: false, error: 'Invalid index' };
    }
  };

  const handleDelete = (index) => {
    setPlanner(planner.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planner</Text>

      <FlatList
        data={planner}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text>{item.name}</Text>
            <TextInput
              placeholder="Assign Time"
              value={item.time}
              onChangeText={(text) => assignTimeSlot(index, text)}
              style={styles.input}
            />
            <Button title="Delete" onPress={() => handleDelete(index)} />
          </View>
        )}
      />

      <Button title="Add Activity/Restaurant" onPress={() => router.push("/screens/addActivity")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: { padding: 10, marginBottom: 10, backgroundColor: "#f0f0f0" },
  input: { borderBottomWidth: 1, marginVertical: 5, padding: 5 },
});

export { isValidTimeFormat, isTimeSlotAvailable };