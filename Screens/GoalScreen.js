import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import AuthContext from "../context/authContext";
import * as Progress from "react-native-progress";
import ConfirmAlert from "../alert/confirmAlert";

const GoalsScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [goals, setGoals] = useState([]);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  const fetchGoals = async () => {
    setError(null);
    try {
      const response = await axios.get(
        `http://192.168.1.9:9080/api/v1/goal/get?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.goal) {
        setGoals(response.data.goal);
        setCurrentGoal(response.data.currentGoal);
        setTotalPages(response.data.totalPages);
      } else {
        setGoals([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [token, page]);

  useEffect(() => {
    if (currentGoal) {
      const targetDateObj = new Date(currentGoal.deadline);
      const currentDate = new Date();
      const timeDiff = targetDateObj - currentDate;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysRemaining);
    }
  }, [currentGoal]);

  const handleDelete = async (id) => {
    setSelectedId(id);
    setAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.1.9:9080/api/v1/goal/delete/${selectedId}`
      );

      if (response.status === 200 || response.status === 204) {
        console.log("Goal deleted:", response.data);

        setCurrentGoal(null);
      } else {
        console.error("Failed to delete goal:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting goal:", error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unknown error occurred"
      );
    } finally {
      setAlertVisible(false);
    }
  };

  const handleContribute = async () => {
    try {
      if (!amount) {
        return;
      }
      const response = await axios.patch(
        `http://192.168.1.9:9080/api/v1/goal/contribute`,
        {
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert(`Successfully added ${amount} to your goal `);
      setAmount("");
    } catch (error) {
      console.error("Error COntributing to goal:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGoals();
  };

  const progress = currentGoal
    ? Math.min(
        (currentGoal.savedAmount || 0) / (currentGoal.targetAmount || 1),
        1
      )
    : 0;

  const renderPageNumbers = () => {
    let pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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

  if (loading && !refreshing) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.goalContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        nestedScrollEnabled={true}
      >
        <View style={styles.GoalCard}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>Current Goal</Text>
            {currentGoal && (
              <Text style={styles.goalTitle}>
                {daysLeft <= 0
                  ? "Expired"
                  : daysLeft !== null
                  ? `${daysLeft} days left`
                  : "Loading target date..."}
              </Text>
            )}
          </View>
          {currentGoal ? (
            <View style={styles.content2}>
              <Text style={styles.goalTitle}>Goal</Text>
              <Text style={styles.goalDetail}>
                {currentGoal?.name || "N/A"}
              </Text>
              <Text style={styles.goalTitle}>Monthly Contribution</Text>
              <Text style={styles.goalDetail}>
                {currentGoal?.monthlyContribution || "N/A"}
              </Text>
              <View style={styles.goalDetailRow}>
                <Text
                  style={styles.goalTitle}
                >{`Target: ${currentGoal.targetAmount}`}</Text>
                <Text
                  style={styles.goalTitle}
                >{`Saved: ${currentGoal.savedAmount}`}</Text>
              </View>
              <Progress.Bar
                progress={progress}
                width={null}
                height={5}
                color="#4CAF50"
                unfilledColor="#E0E0E0"
                borderRadius={20}
                style={styles.progress}
              />
              <Text style={styles.goalTitle}>Description</Text>
              <Text style={styles.goalDetail}>
                {currentGoal?.description || "N/A"}
              </Text>
              <TouchableOpacity
                style={styles.deleteGoal}
                onPress={() => handleDelete(currentGoal._id)}
              >
                <Text style={styles.deleteGoalText}>Delete Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.noGoal}>No Current goal set</Text>
              <TouchableOpacity
                style={styles.setGoal}
                onPress={() =>
                  navigation.navigate("add-goal", {
                    currentGoal: currentGoal,
                  })
                }
              >
                <Text style={styles.setGoalText}>Add New Goal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {currentGoal && <Text style={styles.title}>Goal Contribution</Text>}
        {currentGoal && (
          <View style={styles.goalContribution}>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity
              style={styles.contributeButton}
              onPress={handleContribute}
            >
              <Text style={styles.contributeButtonText}>Contribute</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.title}>Goals History</Text>
        <View style={styles.goals}>
          {goals && goals.length > 0 ? (
            goals.map((item, index) => {
              return (
                <View style={styles.goalsContainer} key={index}>
                  <View style={styles.goalsContainerLeft}>
                    <Text style={styles.goalDate}>{item.targetAmount}</Text>
                    <Text style={styles.goalName}>{item.name}</Text>
                  </View>
                  <View style={styles.goalsContainerRight}>
                    {item.isAchieved ? (
                      <Text style={{ color: "#00796B", fontWeight: "bold" }}>
                        Achieved
                      </Text>
                    ) : (
                      <Text style={{ color: "#D32F2F", fontWeight: "bold" }}>
                        Expired
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <Text>No goals available.</Text>
          )}
        </View>
        {goals && goals.length > 0 && (
          <View style={styles.pagination}>
            {page > 1 && (
              <TouchableOpacity onPress={handlePrevPage}>
                <Text style={styles.pageButton}>{"<"}</Text>
              </TouchableOpacity>
            )}
            {renderPageNumbers().map((pageNumber) => (
              <TouchableOpacity
                key={pageNumber}
                onPress={() => handlePageChange(pageNumber)}
                style={[
                  styles.pageButton,
                  pageNumber === page && styles.activePageButton,
                ]}
              >
                <Text style={styles.pageNumber}>{pageNumber}</Text>
              </TouchableOpacity>
            ))}

            {page < totalPages && (
              <TouchableOpacity onPress={handleNextPage}>
                <Text style={styles.pageButton}>{">"}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      <ConfirmAlert
        visible={alertVisible}
        title="Are You Sure?"
        message="The goal will be deleted completely without a trace"
        onConfirm={confirmDelete}
        onCancel={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    position: "relative",
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  goalContainer: {
    marginHorizontal: 20,
    flexGrow: 1,
  },
  GoalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: "center",
    alignItems: "stretch",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingRight: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  goalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
    paddingRight: 2,
  },
  deleteGoal: {
    backgroundColor: "#D32F2F",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  deleteGoalText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
    marginTop: 2,
  },
  goalDetail: {
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
    alignSelf: "center",
  },
  setGoalText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "bold",
  },
  goalContribution: {
    flex: 1,
    paddingHorizontal: 10,
    paddingRight: 2,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "50%",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  contributeButton: {
    backgroundColor: "#1f1225",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  contributeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  goals: {
    padding: 10,
    marginHorizontal: 10,
  },
  goalsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    paddingRight: 10,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  goalDate: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 8,
  },
  goalName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  goalAmount: {
    color: "#F44336",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  pageNumber: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageButton: {
    fontSize: 18,
    margin: 5,
    padding: 10,
    backgroundColor: "#00796B",
    color: "#fff",
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: "#004D40",
  },
});

export default GoalsScreen;
