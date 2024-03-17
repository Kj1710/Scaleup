import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  BottomModal,
  ModalTitle,
  ModalContent,
  SlideAnimation,
} from "react-native-modals";
import { MaterialIcons } from "@expo/vector-icons";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  sendNotification,
} from "../../components/PushNotification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Index = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("All");
  const [todo, setTodo] = useState("");
  const [pendingTodos, setPendingTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
    getUserTodos();
  }, [marked, isModalVisible]);

  const addTodo = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const todoData = {
        title: todo,
        category: category,
      };

      axios
        .post(`http://192.168.29.184:3000/todos/${userId}`, todoData)
        .then((response) => {
          sendNotification("add", todo, expoPushToken);
        })
        .catch((error) => {
          console.log("axios error in adding the task", error);
        });

      await getUserTodos();
      setModalVisible(false);
      setTodo("");
    } catch (error) {
      console.log("error in adding the task ", error);
    }
  };

  const getUserTodos = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `http://192.168.29.184:3000/users/${userId}/todos`
      );

      console.log(response.data.todos);
      setTodos(response.data.todos);
      setFilteredTodos(response.data.todos);

      const fetchedTodos = response.data.todos || [];
      const pending = fetchedTodos.filter(
        (todo) => todo.status !== "completed"
      );

      const completed = fetchedTodos.filter(
        (todo) => todo.status === "completed"
      );

      setPendingTodos(pending);
      setCompletedTodos(completed);
    } catch (error) {
      console.log("error", error);
    }
  };

  const markTodoAsCompleted = async (todoId, todo) => {
    try {
      sendNotification("complete", todo, expoPushToken);
      setMarked(true);
      const response = await axios.patch(
        `http://192.168.29.184:3000/todos/${todoId}/complete`
      );
      console.log(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteTodo = async (todoId, todo) => {
    try {
      sendNotification("delete", todo, expoPushToken);
      await axios.delete(`http://192.168.29.184:3000/todos/${todoId}`);
      await getUserTodos();
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("completed", completedTodos);
  console.log("pending", pendingTodos);
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Stay Organized with Task Manager</Text>
        <Pressable
          onPress={() => setModalVisible(!isModalVisible)}
          style={styles.addButton}
        >
          <AntDesign name="pluscircle" size={32} color="#007FFF" />
        </Pressable>
      </View>
      <View style={styles.separator} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {todos?.length > 0 ? (
            <View>
              {pendingTodos?.length > 0 && <Text>Task To Complete</Text>}
              {pendingTodos?.map((item, index) => (
                <Pressable style={styles.todoItemContainer} key={index}>
                  <View style={styles.todoItem}>
                    <Entypo
                      onPress={() => markTodoAsCompleted(item?._id)}
                      name="circle"
                      size={18}
                      color="black"
                    />
                    <Text style={styles.todoTitle}>{item?.title}</Text>
                    <MaterialIcons
                      name="label-important-outline"
                      size={24}
                      color="black"
                    />
                  </View>
                </Pressable>
              ))}
              {completedTodos?.length > 0 && (
                <View>
                  <View style={styles.completedTasksHeader}></View>
                  <View style={styles.completedTasksContainer}>
                    <Text style={styles.completedTasksText}>
                      Completed Tasks
                    </Text>
                  </View>
                  {completedTodos?.map((item, index) => (
                    <Pressable
                      style={styles.completedTodoItemContainer}
                      key={index}
                    >
                      <View style={styles.completedTodoItem}>
                        <FontAwesome name="circle" size={18} color="gray" />
                        <Text style={styles.completedTodoTitle}>
                          {item?.title}
                        </Text>
                        <Pressable>
                          <AntDesign
                            name="delete"
                            size={24}
                            color="black"
                            onPress={() => deleteTodo(item._id)}
                          />
                        </Pressable>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noTasksContainer}>
              <Image
                style={styles.noTasksImage}
                source={require("../../../assets/Home.png")}
              />
              <Text style={styles.noTasksText}>
                No Tasks for today! Add a task
              </Text>
              <Pressable
                onPress={() => setModalVisible(!isModalVisible)}
                style={styles.addButtonNoTasks}
              >
                <AntDesign name="pluscircle" size={32} color="#007FFF" />
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        onHardwareBackPress={() => setModalVisible(!isModalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Add a todo" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(!isModalVisible)}
      >
        <ModalContent style={styles.modalContent}>
          <View style={styles.modalInputContainer}>
            <TextInput
              value={todo}
              onChangeText={(text) => setTodo(text)}
              placeholder="Input a new task here"
              style={styles.modalTextInput}
            />
            <Ionicons onPress={addTodo} name="send" size={24} color="orange" />
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
    textAlign: "center",
    backgroundColor: "white",
  },
  addButton: {
    marginLeft: 10,
    marginTop: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
  separator: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    padding: 15,
  },
  todoItemContainer: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 7,
    marginVertical: 10,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  todoTitle: {
    flex: 1,
  },
  completedTasksHeader: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  completedTasksContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginVertical: 10,
  },
  completedTasksText: {
    fontWeight: "bold",
  },
  completedTodoItemContainer: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 7,
    marginVertical: 10,
  },
  completedTodoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  completedTodoTitle: {
    flex: 1,
    textDecorationLine: "line-through",
    color: "gray",
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 130,
    marginLeft: "auto",
    marginRight: "auto",
  },
  noTasksImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  noTasksText: {
    fontSize: 16,
    marginTop: 1,
    fontWeight: "600",
    textAlign: "center",
  },
  addButtonNoTasks: {
    marginTop: 15,
  },
  modalContent: {
    width: "100%",
    height: 70,
  },
  modalInputContainer: {
    marginVertical: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTextInput: {
    padding: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
  },
});
