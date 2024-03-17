import { useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";


export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
};

export const sendNotification = async (action, title, expoPushToken) => {
  console.log("Sending push notification...");

  let messageTitle = "";
  let messageBody = "";

  if (action === "add") {
    messageTitle = "Added a task 💪";
    messageBody = `New task Added: ${title}`;
  } else if (action === "delete") {
    messageTitle = "Deleted a task 🗑️";
    messageBody = "A Task is deleted: ";
  } else if(action==="complete"){
    messageTitle = "Congratulation🎉";
    messageBody = "You Completed a Task !!"
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title: messageTitle,
    body: messageBody,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
