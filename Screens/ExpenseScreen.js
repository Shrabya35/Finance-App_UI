import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AuthContext from "../context/authContext";
import ConfirmAlert from "../alert/confirmAlert";
import axios from "axios";

const ExpenseScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [expense, setExpense] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const getExpense = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `http://192.168.1.9:9080/api/v1/expense/get?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.expense) {
        setExpense(response.data.expense);
        setMonthlyExpense(response.data.monthlyExpense);
        setTotalPages(response.data.totalPages);
      } else {
        setExpense([]);
        setTotalPages(0);
      }
    } catch (error) {
      setError("Failed to load Expense. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getExpense();
  }, [token, page]);

  const handleDelete = async (id) => {
    setSelectedId(id);
    setAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.1.9:9080/api/v1/expense/delete/${selectedId}`
      );

      if (response.status === 200 || response.status === 204) {
        console.log("Expense deleted:", response.data);

        setMonthlyExpense((prevMonthlyExpenses) =>
          prevMonthlyExpenses.filter((expense) => expense._id !== selectedId)
        );
      } else {
        console.error("Failed to delete expense:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting expense:", error.message);
    } finally {
      setAlertVisible(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getExpense();
  };

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
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        nestedScrollEnabled={true}
      >
        <Text style={styles.title}>Monthly Expense!</Text>
        {monthlyExpense && monthlyExpense.length > 0 ? (
          <ScrollView
            style={styles.monthlyExpense}
            horizontal={true}
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
            {monthlyExpense.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.monthlyExpenseCard,
                  { backgroundColor: "#D32F2F" },
                ]}
              >
                <View style={styles.upperRow}>
                  <View style={styles.leftColumn}>
                    <Text style={styles.cardText}>
                      {new Date(item.deductionDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <Text style={styles.amountText}>₹{item.amount}</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      navigation.navigate("edit-expense", { expense: item })
                    }
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noMonthlyExpenseContainer}>
            <Text style={styles.noExpenseText}>No monthly expense set.</Text>
          </View>
        )}
        <Text style={styles.title}>Expense Statements</Text>
        <View style={styles.expenses}>
          {expense && expense.length > 0 ? (
            expense.map((item, index) => {
              return (
                <View style={styles.expenseContainer} key={index}>
                  <View style={styles.expenseContainerLeft}>
                    <Text style={styles.expenseDate}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.expenseName}>{item.name}</Text>
                  </View>
                  <View style={styles.expenseContainerRight}>
                    <Text style={[styles.expenseAmount]}>{item.amount}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text>No recent expense available.</Text>
          )}
        </View>
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
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          navigation.navigate("AuthenticatedStack", { screen: "add-expense" })
        }
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <ConfirmAlert
        visible={alertVisible}
        title="Delete Confirmation"
        message="Are you sure you want to delete this expense?"
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
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    margin: 10,
    marginTop: 20,
  },
  monthlyExpense: {
    height: 120,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  monthlyExpenseCard: {
    width: 250,
    padding: 10,
    paddingTop: 15,
    marginRight: 10,
    borderRadius: 8,
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardText: {
    fontSize: 12,
    color: "#E0E0E0",
    marginBottom: 3,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFEB3B",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noMonthlyExpenseContainer: {
    paddingHorizontal: 20,
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#D32F2F",
    fontSize: 12,
    fontWeight: "bold",
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  expenses: {
    padding: 10,
    marginHorizontal: 10,
  },
  expenseContainer: {
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
  expenseDate: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 8,
  },
  expenseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  expenseAmount: {
    color: "#F44336",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#00796B",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default ExpenseScreen;
