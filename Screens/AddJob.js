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

const AddJob = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);
  const { job } = route.params;
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [organization, setOrganization] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (job) {
      Alert.alert(
        "Ongoing Job Detected",
        "You already have a job. edit it to proceed.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Main", { screen: "Home" }),
          },
        ]
      );
    }
  }, [job]);

  const handleSubmit = async () => {
    if (!name || !salary || !organization) {
      Alert.alert("Please fill in all fields");
      return;
    }

    if (isNaN(salary)) {
      Alert.alert("Invalid Input", "Please enter valid numeric values.");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.1.9:9080/api/v1/job/add`,
        { name, salary, organization },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      setSalary("");
      setOrganization("");

      const message = response?.data?.message || "Goal added successfully!";
      Alert.alert("Success", message, [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Main", {
              screen: "Home",
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error adding goal:", error);
      Alert.alert(
        "Error",
        "There was an issue adding your goal. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Job</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Job Position"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Salary"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
        />
        <TextInput
          style={styles.input}
          placeholder="Organization"
          value={organization}
          onChangeText={setOrganization}
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
    marginBottom: 20,
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

export default AddJob;
