import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AuthContext from "../context/authContext";
import { API_URL } from "@env";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import * as Progress from "react-native-progress";

const HomeScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [userdetail, setUserdetail] = useState({
    user: null,
    job: null,
    currentGoal: null,
    totalExpense: 0,
    activites: null,
  });

  const getUserDetails = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/api/v1/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUserdetail({
        user: userData.user,
        totalExpense: userData.totalExpense,
        job: userData.job,
        currentGoal: userData.currentGoal,
        activities: userData.activities,
      });
    } catch (error) {
      setError("Failed to load user details. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    getUserDetails();
  };
  const progress = userdetail.goal
    ? Math.min(
        (userdetail.goal.savedAmount || 0) /
          (userdetail.goal.targetAmount || 1),
        1
      )
    : 0;

  useEffect(() => {
    if (userdetail?.currentGoal) {
      const targetDateObj = new Date(userdetail.currentGoal.deadline);
      const currentDate = new Date();
      const timeDiff = targetDateObj - currentDate;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysRemaining);
    }
  }, [userdetail?.currentGoal]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          Tap to Retry
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.topSection}>
        <Text style={styles.topTitle}>
          {userdetail.user ? `Hi, ${userdetail.user.name}!` : "Welcome!"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile's Summary</Text>

        <View style={styles.content}>
          <View style={styles.section}>
            <Icon name="wallet" size={24} color="#00796B" />
            <View style={styles.textWrapper}>
              <Text style={styles.label}>Pocket</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: userdetail.user?.pocket >= 0 ? "#00796B" : "#D32F2F",
                  },
                ]}
              >
                {userdetail.user?.pocket !== null &&
                userdetail.user?.pocket !== undefined
                  ? `${userdetail.user.pocket}`
                  : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.subSection}>
              <Icon name="cash" size={20} color="#00796B" />
              <View style={styles.textWrapper}>
                <Text style={styles.label}>Salary</Text>
                <Text style={[styles.value, { color: "#00796B" }]}>
                  {userdetail.job?.salary !== null &&
                  userdetail.job?.salary !== undefined
                    ? `${userdetail.job.salary}`
                    : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.subSection}>
              <Icon name="card-outline" size={20} color="#F44336" />
              <View style={styles.textWrapper}>
                <Text style={styles.label}>Expenses</Text>
                <Text style={[styles.value, { color: "#F44336" }]}>
                  {userdetail.totalExpense !== null &&
                  userdetail.totalExpense !== undefined
                    ? `${userdetail.totalExpense}`
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.jobGoal}>
        <View style={styles.jobGoalTop}>
          <Text style={styles.jobGoalTitle}>Shortcuts</Text>
        </View>
        <View style={styles.jobGoalBottom}>
          <View style={styles.jobGoalCard}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>My Job</Text>
              {userdetail.job && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("edit-job", { job: userdetail.job })
                  }
                >
                  <Icon name="pencil" size={15} color="#00796B" />
                </TouchableOpacity>
              )}
            </View>
            {userdetail.job ? (
              <View style={styles.content2}>
                <Text style={styles.jobTitle}>Position</Text>
                <Text style={styles.jobDetail}>
                  {userdetail.job?.name || "N/A"}
                </Text>
                <Text style={styles.jobTitle}>Organization</Text>
                <Text style={styles.jobDetail}>
                  {userdetail.job?.organization || "N/A"}
                </Text>
                <Text style={styles.jobTitle}>Salary</Text>
                <Text style={styles.jobDetail}>
                  {userdetail.job?.salary || "N/A"}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.noGoal}>No Job set</Text>
                <TouchableOpacity
                  style={styles.setGoal}
                  onPress={() =>
                    navigation.navigate("add-job", {
                      job: userdetail.job,
                    })
                  }
                >
                  <Text style={styles.setGoalText}>Add Job</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.jobGoalCard}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>Current Goal</Text>
            </View>
            {userdetail.currentGoal ? (
              <View style={styles.content2}>
                <Text style={styles.jobTitle}>Goal</Text>
                <Text style={styles.jobDetail}>
                  {userdetail.currentGoal?.name || "N/A"}
                </Text>
                <Text style={styles.jobTitle}>Progress</Text>
                <Progress.Bar
                  progress={progress}
                  width={null}
                  height={5}
                  color="#4CAF50"
                  unfilledColor="#E0E0E0"
                  borderRadius={20}
                  style={styles.progress}
                />
                <Text style={styles.jobTitle}>Deadline</Text>
                <Text style={styles.jobDetail}>
                  {daysLeft <= 0
                    ? "Expired"
                    : daysLeft !== null
                    ? `Days left: ${daysLeft}`
                    : "Loading target date..."}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.noGoal}>No Current goal set</Text>
                <TouchableOpacity
                  style={styles.setGoal}
                  onPress={() =>
                    navigation.navigate("add-goal", {
                      currentGoal: userdetail.currentGoal,
                    })
                  }
                >
                  <Text style={styles.setGoalText}>Add New Goal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.recentActivity}>
        <Text style={styles.jobGoalTitle}>Recent Activities</Text>
        {userdetail.activities && userdetail.activities.length > 0 ? (
          userdetail.activities.map((item, index) => {
            const isIncome = item.description ? true : false;
            const amountStyle = isIncome
              ? { color: "#00796B" }
              : { color: "#F44336" };

            return (
              <View style={styles.activityContainer} key={index}>
                <View style={styles.activityContainer} key={index}>
                  <View style={styles.activityContainerLeft}>
                    <View>
                      {isIncome ? (
                        <Icon
                          name="trending-up-outline"
                          size={20}
                          color="#00796B"
                        />
                      ) : (
                        <Icon
                          name="trending-down-outline"
                          size={15}
                          color="#F44336"
                        />
                      )}
                    </View>
                    <View style={styles.activityContainerLeftDetail}>
                      <Text style={styles.label}>
                        {new Date(item.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.value}>{item.name}</Text>
                    </View>
                  </View>
                  <View style={styles.activityContainerRight}>
                    <Text style={[styles.activityText, amountStyle]}>
                      {item.amount}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text>No recent activities available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#00796B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginHorizontal: 20,
  },
  retryText: {
    marginTop: 20,
    fontSize: 16,
    color: "#00796B",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  subSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E0E0E0",
  },
  label: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  textWrapper: {
    marginLeft: 8,
  },
  jobGoal: {
    marginBottom: 16,
    padding: 10,
  },
  jobGoalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  jobGoalBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobGoalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "48%",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
    marginTop: 2,
  },
  jobDetail: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  progress: {
    marginTop: 5,
    marginBottom: 5,
    width: "100%",
  },
  noGoal: {
    textAlign: "center",
    marginTop: 25,
    fontWeight: "bold",
  },
  setGoal: {
    paddingVertical: 8,
    marginVertical: 10,
    width: "100%",
    backgroundColor: "#00796B",
    borderRadius: 8,
    alignItems: "center",
  },
  setGoalText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "bold",
  },
  recentActivity: {
    padding: 10,
    marginVertical: 10,
  },
  activityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    paddingRight: 10,
    width: "100%",
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  activityContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityContainerLeftDetail: {
    marginLeft: 10,
  },
});

export default HomeScreen;
