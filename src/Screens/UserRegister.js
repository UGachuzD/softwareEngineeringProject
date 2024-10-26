// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { VStack, Input, Button, Text, Center, Heading } from "native-base";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState(""); 
  const [height, setHeight] = useState("");  
  const [birthDate, setBirthDate] = useState(""); 
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      // Registramos al usuario en la autenticación
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Agregamos información del usuario en Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        name: name,
        lastName: lastName,
        email: user.email,
        createdAt: new Date().toISOString(),
        weight: weight,
        height: height,
        birthDate: birthDate
      });

      // Navegamos a la pantalla Home
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
          width="80%"
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          width="80%"
        />
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
        <Input
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          width="80%"
        />
        <Input
          placeholder="Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          width="80%"
        />
        <Input
          placeholder="Birth Date (YYYY-MM-DD)"
          value={birthDate}
          onChangeText={setBirthDate}
          width="80%"
        />
        {error ? <Text color="red.500">{error}</Text> : null}
        <Button onPress={handleRegister}>Register</Button>
        <Button variant="link" onPress={() => navigation.navigate("LoginScreen")}>
          Already have an account? Log in
        </Button>
      </VStack>
    </Center>
  );
};

export default RegisterScreen;
