import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  StatusBar,
  Dimensions, 
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

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
      router.replace("/(tabs)/home");
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
            <MaterialIcons name="email" size={width * 0.06} color="gray" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="black"
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="lock1" size={width * 0.06} color="gray" />
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
    paddingHorizontal: width * 0.05, 
    marginBottom: height * 0.02, 
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: width * 0.04, 
    padding: width * 0.06, 
    alignItems: "center",
  },
  headerText: {
    fontSize: width * 0.06, 
    fontWeight: "600",
    color: "black",
    marginBottom: height * 0.02, 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: width * 0.04,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04, 
    paddingVertical: height * 0.015,
  },
  input: {
    flex: 1,
    color: "gray",
    marginLeft: width * 0.03,
    fontSize: width * 0.04,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "orange",
    padding: width * 0.05,
    borderRadius: width * 0.02,
    marginTop: height * 0.03,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  signupText: {
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: width * 0.035,
    color: "gray",
    marginTop: height * 0.02,
  },
});

export default login;
