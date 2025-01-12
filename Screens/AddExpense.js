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

const AddExpense = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [deductionDate, setDeductionDate] = useState("");

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount);
    if (!name || !numericAmount || (isRecurring && !deductionDate)) {
      Alert.alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.1.9:9080/api/v1/expense/add`,
        {
          name,
          amount: numericAmount,
          isRecurring,
          deductionDate: isRecurring ? deductionDate : getCurrentDate(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset form
      setName("");
      setAmount("");
      setIsRecurring(false);
      setDeductionDate("");

      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Main", { screen: "Expense" }),
        },
      ]);
    } catch (error) {
      console.error("Error adding expense:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

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
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Is Recurring?</Text>
          <Switch value={isRecurring} onValueChange={setIsRecurring} />
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
        <Text style={styles.submitButtonText}>Add Expense</Text>
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
    color: "#D32F2F",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#D32F2F",
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
    backgroundColor: "#D32F2F",
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

export default AddExpense;
