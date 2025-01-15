import React, { useState, useContext } from "react";
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

const EditJob = ({ navigation, route }) => {
  const { job } = route.params;
  const { token } = useContext(AuthContext);
  const [name, setName] = useState(job.name);
  const [salary, setSalary] = useState(job.salary);
  const [organization, setOrganization] = useState(job.organization);

  const handleSubmit = async () => {
    const numericSalary = parseFloat(salary);
    if (!name || !numericSalary || !organization) {
      Alert.alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.1.9:9080/api/v1/job/update/${job._id}`,
        {
          name,
          salary: numericSalary,
          organization,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      setSalary("");
      setOrganization("");

      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Main", { screen: "Home" }),
        },
      ]);
    } catch (error) {
      console.error("Error editing Job:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Job</Text>

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
          value={String(salary)}
          onChangeText={(text) => setSalary(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Organization Name"
          value={organization}
          onChangeText={setOrganization}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Edit Job</Text>
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
    color: "#007bff",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#007bff",
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

export default EditJob;
