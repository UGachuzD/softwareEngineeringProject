import React from 'react';
import { NativeBaseProvider, Button, Text, Center } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

const Tab = createBottomTabNavigator();

// Primer componente de la pantalla
const DashboardScreen = () => {
  return (
    <Center flex={1}>
      <Text fontSize="lg" mb={4}>Home</Text>
      <Button onPress={() => console.log("Home Button!")}>Home Button</Button>
    </Center>
  );
};

// Segundo componente de la pantalla
const EntriesScreen = () => {
  return (
    <Center flex={1}>
      <Text fontSize="lg" mb={4}>Settings</Text>
      <Button onPress={() => console.log("Settings Button!")}>Settings Button</Button>
    </Center>
  );
};

// Tercer componente de la pantalla
const ReportScreen = () => {
  return (
    <Center flex={1}>
      <Text fontSize="lg" mb={4}>Reports</Text>
      <Button onPress={() => console.log("Reports Button!")}>Reports Button</Button>
    </Center>
  );
};

// Cuarto componente de la pantalla
const ProfileScreen = () => {
  return (
    <Center flex={1}>
      <Text fontSize="lg" mb={4}>Profile</Text>
      <Button onPress={() => console.log("Profile Button!")}>Profile Button</Button>
    </Center>
  );
};

const ModelScreen = () => {
  return (
    <Center flex={1}>
      <Text fontSize="lg" mb={4}>Model</Text>
      <Button onPress={() => console.log("Model Button!")}>Model Button</Button>
    </Center>
  );
};

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
