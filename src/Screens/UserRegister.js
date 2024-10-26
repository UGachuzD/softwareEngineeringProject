// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { VStack, Input, Button, Text, Center, Heading } from "native-base";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Center flex={1} px={4}>
      <VStack space={4} alignItems="center" mt={10}>
        <Heading>Register</Heading>
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
        <Button onPress={handleRegister}>Register</Button>
        <Button variant="link" onPress={() => navigation.navigate("Login")}>
          Already have an account? Log in
        </Button>
      </VStack>
    </Center>
  );
};

export default RegisterScreen;
