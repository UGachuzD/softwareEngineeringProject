import React, { useState } from 'react';
import { NativeBaseProvider, Button, Text, Center, Input, VStack } from 'native-base';
import appFirebase from '../firebase/credentials';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth(appFirebase);

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuario loggeado:', user);
      
      navigation.replace('Home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  return (
    <NativeBaseProvider>
      <Center flex={1} px={4}>
        <VStack space={4} w="100%" maxW="300px">
          <Text fontSize="2xl" mb={4} textAlign="center">
            Login
          </Text>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            mb={2}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            type="password"
            secureTextEntry
            mb={2}
          />
          <Button onPress={handleLogin} colorScheme="primary" mt={4}>
            Login
          </Button>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
};

export default Login;
