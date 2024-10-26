// src/screens/LoginScreen.js
import React, { useState } from "react";
import { VStack, Input, Button, Text, Center, Heading } from "native-base";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home"); // Navigate to Home after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Center flex={1} px={4}>
      <VStack space={4} alignItems="center" mt={10}>
        <Heading>Login</Heading>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          width="80%"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          width="80%"
        />
        {error ? <Text color="red.500">{error}</Text> : null}
        <Button onPress={handleLogin} >Login</Button>
        <Button variant="link" onPress={() => navigation.navigate("Register")}>
          Don't have an account? Register
        </Button>
      </VStack>
    </Center>
  );
};

export default LoginScreen;
