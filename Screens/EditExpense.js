import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import AuthContext from "../context/authContext";
import axios from "axios";
import { API_URL } from "@env";

const EditExpense = ({ navigation, route }) => {
  const { expense } = route.params;
  const { token } = useContext(AuthContext);
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount);
  const [isRecurring, setIsRecurring] = useState(true);
  const [deductionDate, setDeductionDate] = useState(expense.deductionDate);

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount);
    if (!name || !numericAmount || (isRecurring && !deductionDate)) {
      Alert.alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/v1/expense/update/${expense._id}`,
        {
          name,
          amount: numericAmount,
          isRecurring,
          deductionDate: isRecurring ? deductionDate : getCurrentDate(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      setAmount("");
      setIsRecurring(true);
      setDeductionDate("");

      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Main", { screen: "Expense" }),
        },
      ]);
    } catch (error) {
      console.error("Error editing expense:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Expense</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Expense Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={String(amount)}
          onChangeText={(text) => setAmount(text)}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Is Recurring?</Text>
          <Switch
            value={isRecurring}
            onValueChange={setIsRecurring}
            disabled={true}
          />
        </View>
        {isRecurring && (
          <TextInput
            style={styles.input}
            placeholder="Deduction Date (e.g., YYYY-MM-DD)"
            value={deductionDate}
            onChangeText={setDeductionDate}
          />
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Edit Expense</Text>
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

export default EditExpense;
