import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import AuthContext from "../context/authContext";
import LoginScreen from "../Screens/LoginScreen";
import SignupScreen from "../Screens/SignupScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AddIncome from "../Screens/AddIncome";
import AddExpense from "../Screens/AddExpense";
import EditExpense from "../Screens/EditExpense";

const Stack = createStackNavigator();
const AuthenticatedStack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen
          name="AuthenticatedStack"
          component={AuthenticatedStackScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const AuthenticatedStackScreen = () => (
  <AuthenticatedStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthenticatedStack.Screen
      name="Main"
      component={BottomTabNavigator}
      options={{ headerShown: false }}
    />
    <AuthenticatedStack.Screen
      name="add-income"
      component={AddIncome}
      options={{
        headerShown: true,
        title: "Add Income",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#00796B",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <AuthenticatedStack.Screen
      name="add-expense"
      component={AddExpense}
      options={{
        headerShown: true,
        title: "Add Expense",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#D32F2F",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <AuthenticatedStack.Screen
      name="edit-expense"
      component={EditExpense}
      options={{
        headerShown: true,
        title: "Edit Expense",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#007bff",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  </AuthenticatedStack.Navigator>
);

export default AppNavigator;
