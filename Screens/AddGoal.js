import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AuthContext from "../context/authContext";
import axios from "axios";

const AddGoal = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);
  const { currentGoal } = route.params;
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (currentGoal) {
      Alert.alert(
        "Ongoing Goal Detected",
        "You already have an ongoing Goal. Complete or delete it to proceed.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Main", { screen: "Goal" }),
          },
        ]
      );
    }
  }, [currentGoal]);

  const handleSubmit = async () => {
    if (
      !name ||
      !targetAmount ||
      !description ||
      !monthlyContribution ||
      !deadline
    ) {
      Alert.alert("Please fill in all fields");
      return;
    }

    if (isNaN(targetAmount) || isNaN(monthlyContribution)) {
      Alert.alert("Invalid Input", "Please enter valid numeric values.");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.1.9:9080/api/v1/goal/add`,
        { name, targetAmount, description, monthlyContribution, deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      setTargetAmount("");
      setDescription("");
      setMonthlyContribution("");
      setDeadline("");

      const message = response?.data?.message || "Goal added successfully!";
      Alert.alert("Success", message, [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Main", {
              screen: "Goal",
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error adding goal:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Goal</Text>
      <Text style={styles.warn}>
        Warning : You can't edit a goal once Created.
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Goal Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Target Amount"
          keyboardType="numeric"
          value={targetAmount}
          onChangeText={setTargetAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Monthly Contribution"
          keyboardType="numeric"
          value={monthlyContribution}
          onChangeText={setMonthlyContribution}
        />
        <TextInput
          style={styles.input}
          placeholder="Deadline Date (e.g., YYYY-MM-DD)"
          value={deadline}
          onChangeText={setDeadline}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Goal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  warn: {
    color: "#D32F2F",
    marginBottom: 20,
    fontWeight: "bold",
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#00796B",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#00796B",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddGoal;
