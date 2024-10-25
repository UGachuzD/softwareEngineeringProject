import React, { useState, useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Para controlar el estado del usuario

import Home from './src/screens/Home'; // Importa la nueva pantalla Home
import LoginScreen from './src/screens/Login';  // Importa tu pantalla de login

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <Stack.Screen 
              name="Home" 
              component={Home} // Usamos la nueva pantalla Home
              options={{ headerShown: false }} 
            />
          ) : (
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
