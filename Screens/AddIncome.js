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
import { API_URL } from "@env";
import axios from "axios";

const AddIncome = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!name || !amount || !description) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/income/add`,
        { name, amount, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      setAmount("");
      setDescription("");

      const message = response?.data?.message || "Income added successfully!";
      Alert.alert("Success", message, [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Main", {
              screen: "Income",
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error adding income:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Income</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Income Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
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
        <Text style={styles.submitButtonText}>Add Income</Text>
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

export default AddIncome;
