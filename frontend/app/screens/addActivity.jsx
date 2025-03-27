import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function AddActivity() {
  const router = useRouter();
  const [activityName, setActivityName] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Activity</Text>
      <TextInput
        placeholder="Enter activity name"
        value={activityName}
        onChangeText={setActivityName}
        style={styles.input}
      />
      <Button
        title="Add Activity"
        onPress={() => {
          if (activityName.trim() !== "") {
            router.push({pathname: "/Planner/planner", params: { item: activityName }});
          }
        }}
      />
      <Button title="Cancel" onPress={() => router.back()} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderBottomWidth: 1, width: "80%", padding: 10, marginVertical: 10 },
});
