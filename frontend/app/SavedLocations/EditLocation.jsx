import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditLocation() {
  const router = useRouter();
  const { locationName, description, date, time, email } =
    useLocalSearchParams();

  const [name, setName] = useState(locationName);
  const [desc, setDesc] = useState(description);
  const [locDate, setDate] = useState(date);
  const [locTime, setTime] = useState(time);
  const [locEmail, setEmail] = useState(email);

  const handleSave = () => {
    // Handle save logic here, such as updating the database or state
    console.log("Saved", { name, desc, locDate, locTime, locEmail });
    // Navigate back or show a success message
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Location</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Location Name"
      />
      <TextInput
        style={styles.input}
        value={desc}
        onChangeText={setDesc}
        placeholder="Description"
      />
      <TextInput
        style={styles.input}
        value={locDate}
        onChangeText={setDate}
        placeholder="Date"
      />
      <TextInput
        style={styles.input}
        value={locTime}
        onChangeText={setTime}
        placeholder="Time"
      />
      <TextInput
        style={styles.input}
        value={locEmail}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 5,
  },
});
