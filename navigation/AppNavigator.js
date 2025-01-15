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
import AddGoal from "../Screens/AddGoal";
import AddJob from "../Screens/AddJob";
import EditJob from "../Screens/EditJob";

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
  <AuthenticatedStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerShown: false,
    }}
  >
    <AuthenticatedStack.Screen name="Main" component={BottomTabNavigator} />
    <AuthenticatedStack.Screen
      name="add-income"
      component={AddIncome}
      options={{
        headerShown: true,
        title: "Add Income",
        headerStyle: {
          backgroundColor: "#00796B",
        },
      }}
    />
    <AuthenticatedStack.Screen
      name="add-expense"
      component={AddExpense}
      options={{
        headerShown: true,
        title: "Add Expense",
        headerStyle: {
          backgroundColor: "#D32F2F",
        },
      }}
    />
    <AuthenticatedStack.Screen
      name="edit-expense"
      component={EditExpense}
      options={{
        headerShown: true,
        title: "Edit Expense",
        headerStyle: {
          backgroundColor: "#007bff",
        },
      }}
    />
    <AuthenticatedStack.Screen
      name="add-goal"
      component={AddGoal}
      options={{
        headerShown: true,
        title: "Add Goal",
        headerStyle: {
          backgroundColor: "#00796B",
        },
      }}
    />
    <AuthenticatedStack.Screen
      name="add-job"
      component={AddJob}
      options={{
        headerShown: true,
        title: "Add Job",
        headerStyle: {
          backgroundColor: "#00796B",
        },
      }}
    />
    <AuthenticatedStack.Screen
      name="edit-job"
      component={EditJob}
      options={{
        headerShown: true,
        title: "Edit Job",
        headerStyle: {
          backgroundColor: "#007bff",
        },
      }}
    />
  </AuthenticatedStack.Navigator>
);

export default AppNavigator;
