//FCMService.js
import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import {useEffect} from 'react';

const FCMService = {
  // Request permission to receive notifications
  requestUserPermission: async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted.');
    } else {
      Alert.alert('Notification permission not granted');
    }
  },

  // Get the device's FCM token
  getFcmToken: async () => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        // Optionally, you can send the FCM token to your server
      } else {
        console.warn('Failed to get FCM token');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  },

  // Listen for incoming notifications
  registerNotificationListeners: () => {
    // Foreground notifications
    messaging().onMessage(async remoteMessage => {
      Alert.alert('New FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // Background and quit-state notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  },

  // Initialize FCM service
  initialize: async () => {
    await FCMService.requestUserPermission();
    await FCMService.getFcmToken();
    FCMService.registerNotificationListeners();
  },
};

export default FCMService;
