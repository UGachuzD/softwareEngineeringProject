// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { VStack, Input, Button, Text, Center, Heading, Icon } from "native-base";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [weight, setWeight] = useState(""); 
  const [height, setHeight] = useState("");  
  const [birthDate, setBirthDate] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, "users", user.uid), {
        name: name,
        lastName: lastName,
        email: user.email,
        createdAt: new Date().toISOString(),
        weight: weight,
        height: height,
        birthDate: birthDate.toISOString().split('T')[0]
      });

      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  return (
    <Center flex={1} px={4}>
      <VStack space={4} alignItems="center" mt={10}>
        <Heading>Register</Heading>
        <Input placeholder="Name" value={name} onChangeText={setName} width="80%" />
        <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} width="80%" />
        <Input placeholder="Email" value={email} onChangeText={setEmail} width="80%" />
        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} InputRightElement={
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
          } width="80%" />
        <Input placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" width="80%" />
        <Input placeholder="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" width="80%" />

        {/* Input para Fecha de Nacimiento con Icono */}
        <Input
          placeholder="Birth Date (YYYY-MM-DD)"
          value={birthDate.toISOString().split('T')[0]}
          isReadOnly
          width="80%"
          InputRightElement={
            <Icon
              as={<Ionicons name="calendar" />}
              size="md"
              onPress={() => setShowDatePicker(true)}
              mr={2}
              color="gray.500"
            />
          }
        />

        {/* Selector de Fecha */}
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

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
