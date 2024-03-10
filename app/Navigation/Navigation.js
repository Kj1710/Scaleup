import React from "react";
import { Tabs, Stack } from "expo-router";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ModalPortal } from "react-native-modals";

const Navigation = () => {
  return (
    <>
      {/* Stack Navigator */}
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>

      {/* Modal Portal */}
      <ModalPortal />

      {/* Tabs Navigator */}
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "#7CB9E8" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome name="tasks" size={24} color="#7CB9E8" />
              ) : (
                <FontAwesome name="tasks" size={24} color="black" />
              ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Navigation;
