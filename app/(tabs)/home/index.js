import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewBase,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { BottomModal } from "react-native-modals";
import { ModalTitle, ModalContent } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {registerForPushNotificationsAsync , sendNotification } from "../../components/PushNotification"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const index = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]); // State for filtered todos
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("All");
  const [todo, setTodo] = useState("");
  const [pendingTodos, setPendingTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token: ", token);
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
          console.log(response);
        })
        .catch((error) => {
          console.log("error", error);
        });

      await getUserTodos();
      setModalVisible(false);
      setTodo("");
    } catch (error) {
      console.log("error", error);
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

  const handleSearch = (query) => {
    console.log("Search History", query);
    setSearchQuery(query); // Update search query state

    // Filter todos based on search query
    const filtered = todos.filter((todo) =>
      todo.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTodos(filtered); // Update filtered todos state
  };

  const markTodoAsCompleted = async (todoId) => {
    try {
      setMarked(true);
      const response = await axios.patch(
        `http://192.168.29.184:3000/todos/${todoId}/complete`
      );
      console.log(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      console.log("Token removed from AsyncStorage");
      router.push("/(authenticate)/login");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  const deleteTodo = async (todoId, title) => {
    try {
      sendNotification("delete", title, expoPushToken);
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
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <TextInput
          onPress={() => handleSearch()}
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
          placeholder="Search tasks"
          style={{
            padding: 10,
            borderColor: "#E0E0E0",
            borderWidth: 1,
            borderRadius: 5,
            flex: 1,
          }}
        />
        <Pressable
          onPress={() => handleSearch(searchQuery)}
          style={{
            marginLeft: 10,
            marginTop: 15,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 10,
          }}
        >
          <Feather name="search" size={24} color="#007FFF" />
        </Pressable>
      </View>
      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 1,
        }}
      />

      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "orange",
            textAlign: "center",
            backgroundColor: "white",
          }}
        >
          Stay Organized with Task Manager
        </Text>
        <Pressable
          onPress={() => setModalVisible(!isModalVisible)}
          style={{
            marginLeft: 10,
            marginTop: 15,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 10,
          }}
        >
          <AntDesign name="pluscircle" size={32} color="#007FFF" />
        </Pressable>
      </View>
      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 1,
        }}
      />

      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ padding: 15 }}>
          {todos?.length > 0 ? (
            <View>
              {pendingTodos?.length > 0 && <Text>Task To Complete</Text>}

              {pendingTodos?.map((item, index) => (
                <Pressable
                  onPress={() => {
                    router?.push({
                      pathname: "/home/info",
                      params: {
                        id: item._id,
                        title: item?.title,
                        category: item?.category,
                        createdAt: item?.createdAt,
                        dueDate: item?.dueDate,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: "#E0E0E0",
                    padding: 10,
                    borderRadius: 7,
                    marginVertical: 10,
                  }}
                  key={index}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Entypo
                      onPress={() => markTodoAsCompleted(item?._id)}
                      name="circle"
                      size={18}
                      color="black"
                    />
                    <Text style={{ flex: 1 }}>{item?.title}</Text>
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
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 10,
                    }}
                  ></View>

                  <Text
                    style={{
                      height: 1,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 1,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginVertical: 10,
                    }}
                  >
                    <Text>Completed Tasks</Text>
                  </View>

                  {completedTodos?.map((item, index) => (
                    <Pressable
                      style={{
                        backgroundColor: "#E0E0E0",
                        padding: 10,
                        borderRadius: 7,
                        marginVertical: 10,
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <FontAwesome name="circle" size={18} color="gray" />
                        <Text
                          style={{
                            flex: 1,
                            textDecorationLine: "line-through",
                            color: "gray",
                          }}
                        >
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 130,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Image
                style={{ width: 250, height: 250, resizeMode: "contain" }}
                source={{
                  uri: "https://imgs.search.brave.com/BjUUwsVwfnhlm5zgEt5B8O7K8ZrnRv-Efb2lZQPVLSU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdG9y/ZS1pbWFnZXMubWlj/cm9zb2Z0LmNvbS9p/bWFnZS9hcHBzLjE5/NTA3LjkwMDcxOTky/NjYzNjM5MDYuZDRl/YTA0ZDYtM2I0Zi00/YmVlLWJmMzktMTgy/ZjhmNDhmOGI5LmE2/MDY2MTRjLTc0NjQt/NGE3NC05OTJiLTM5/NDBmNzlhODc1Yg",
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                No Tasks for today! add a task
              </Text>
              <Pressable
                onPress={() => setModalVisible(!isModalVisible)}
                style={{ marginTop: 15 }}
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
        <ModalContent style={{ width: "100%", height: 70 }}>
          <View
            style={{
              marginVertical: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextInput
              value={todo}
              onChangeText={(text) => setTodo(text)}
              placeholder="Input a new task here"
              style={{
                padding: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 5,
                flex: 1,
              }}
            />
            <Ionicons onPress={addTodo} name="send" size={24} color="orange" />
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});

// change code for searcxh button
