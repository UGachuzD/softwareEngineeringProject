// src/screens/LoginScreen.js
import React, { useState } from "react";
import { VStack, Input, Button, Text, Center, Heading, Icon } from "native-base";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
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
          secureTextEntry={!showPassword}
          width="80%"
          InputRightElement={
            <Button
              variant="unstyled"
              onPress={() => setShowPassword(!showPassword)}
              p={2}
            >
              <Icon
                as={Ionicons}
                name={showPassword ? "eye-off" : "eye"}
                size="sm"
              />
            </Button>
          }
        />
        {error ? <Text color="red.500">{error}</Text> : null}
        <Button onPress={handleLogin}>Login</Button>
        <Button variant="link" onPress={() => navigation.navigate("Register")}>
          Don't have an account? Register
        </Button>
      </VStack>
    </Center>
  );
};

export default LoginScreen;
