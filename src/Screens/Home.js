import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

import DashboardScreen from './DashboardScreen';
import EntriesScreen from './EntriesScreen';
import ReportScreen from './ReportScreen';
import ProfileScreen from './ProfileScreen';
import ModelScreen from './ModelScreen';

// Crea el Tab Navigator
const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard" // Establece Dashboard como la pestaña predeterminada
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'home'; 
          } else if (route.name === 'Entries') {
            iconName = 'calendar'; 
          } else if (route.name === 'Reports') {
            iconName = 'bar-chart';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Model') {
            iconName = 'codepen';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Entries" component={EntriesScreen} />
      <Tab.Screen name="Reports" component={ReportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Model" component={ModelScreen} />
    </Tab.Navigator>
  );
};

export default Home;
