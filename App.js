import React from 'react';
import { NativeBaseProvider, Button, Text, Center } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import DashboardScreen from './src/Screens/DashboardScreen';
import EntriesScreen from './src/Screens/EntriesScreen';
import ReportScreen from './src/Screens/ReportScreen';
import ProfileScreen from './src/Screens/ProfileScreen'
import ModelScreen from './src/Screens/ModelScreen';

const Tab = createBottomTabNavigator();

// Configuración del navegador
const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator
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

              // Retorna el ícono de FontAwesome
              return <FontAwesome name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',  // Color de ícono activo
            tabBarInactiveTintColor: 'gray',  // Color de ícono inactivo
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Entries" component={EntriesScreen} />
          <Tab.Screen name="Reports" component={ReportScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Model" component={ModelScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
