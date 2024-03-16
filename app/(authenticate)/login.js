import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.push("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus();
  }, []);
  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios.post("http://192.168.29.184:3000/login", user).then((response) => {
      const token = response.data.token;
      const userId = response.data.userId;
      console.log("token", token);
      AsyncStorage.setItem("authToken", token);
      AsyncStorage.setItem("userId", userId);
      router.replace("/Home/home");
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />

      <KeyboardAvoidingView style={styles.contentContainer}>
        <Text style={styles.headerText}>Task Manager | ScaleUp</Text>

        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Log in to your account</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="gray" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="black"
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="lock1" size={24} color="gray" />
            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="black"
            />
          </View>

          <Pressable onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/register")}
            style={styles.signupText}
          >
            <Text style={styles.signupText}>
              Don't have an account? Sign up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: "gray",
    marginLeft: 10,
    fontSize: 17,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 6,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  signupText: {
    textAlign: "center",
    fontSize: 15,
    color: "gray",
    marginTop: 7,
  },
});

export default login;
