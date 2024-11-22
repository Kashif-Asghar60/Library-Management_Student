import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Import your screens
import SettingsScreen from '../screens/SettingsScreen';
import SignIn from '../Auth/SignIn';
import HomeScreen from '../screens/HomeScreen';
import BookDetails from '../screens/BookDetails';
import MyBooks from '../screens/MyBooks';
import ActivityScreen from '../screens/ActivityScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SignUp from '../Auth/SignUp';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingBottom: 15,
          height: 75,
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: color, fontSize: 10, fontWeight: 'bold'}}>
              Home
            </Text>
          ),
          tabBarIcon: () => (
            <Text style={{fontSize: 16, color: 'gray'}}>🏠</Text>
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="MyBooks"
        component={MyBooks}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: color, fontSize: 10, fontWeight: 'bold'}}>
              My Books
            </Text>
          ),
          tabBarIcon: () => (
            <Text style={{fontSize: 22, color: 'gray'}}>📚</Text> // Example: book icon as text
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: color, fontSize: 10, fontWeight: 'bold'}}>
              Activity
            </Text>
          ),
          tabBarIcon: () => (
            <Text style={{fontSize: 22, color: 'gray'}}>⚡</Text>
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: color, fontSize: 10, fontWeight: 'bold'}}>
              Notifications
            </Text>
          ),
          tabBarIcon: () => (
            <Text style={{fontSize: 20, color: 'gray'}}>🔔</Text>
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: color, fontSize: 10, fontWeight: 'bold'}}>
              Settings
            </Text>
          ),
          tabBarIcon: () => (
            <Text style={{fontSize: 22, color: 'gray'}}>⚙️</Text>
          ),
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
};

// Main navigator
const MainNavigator = ({isFirstLaunch, isLoggedIn}) => {
  console.log('isFirstLaunch', isFirstLaunch);
  console.log('isLoggedIn', isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          isFirstLaunch ? 'SignIn' : isLoggedIn ? 'Main' : 'SignIn'
        }>
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="BookDetails" component={BookDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
