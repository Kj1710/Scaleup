import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password should be at least 6 characters long"
      );
      return;
    }

    axios
      .post("http://192.168.29.184:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered successfully"
        );
        router.push("/login");
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
        console.log("error", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.contentContainer}>
        <Text style={styles.headerText}>Task Manager | ScaleUp</Text>

        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Register to your account</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={width * 0.06}
              color="gray"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="gray"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={width * 0.06} color="gray" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="gray"
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="lock1" size={width * 0.06} color="gray" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="gray"
              secureTextEntry={true}
            />
          </View>

          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/login")}
            style={styles.loginText}
          >
            <Text style={styles.signupText}>
              Already have an account? Sign in
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
  registerButton: {
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
  loginText: {
    marginTop: height * 0.015,
  },
  signupText: {
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: width * 0.035,
    color: "gray",
  },
});

export default Register;
