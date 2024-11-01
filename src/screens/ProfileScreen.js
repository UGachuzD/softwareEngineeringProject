import React, { useState, useEffect } from "react";
import {
  NativeBaseProvider,
  Box,
  Input,
  Button,
  VStack,
  Center,
  FormControl,
  Modal,
  Text,
  Icon,
} from "native-base";
import { getAuth, signOut } from "firebase/auth";
import { firestore } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [correo, setCorreo] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [horasSueno, setHorasSueno] = useState("");
  const [nivelGlucosa, setNivelGlucosa] = useState("");
  const [carbIngeridos, setCarbIngeridos] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = doc(firestore, "users", user.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setName(userData.name || "");
            setCorreo(userData.email || "");
            setAltura(userData.height || "");
            setPeso(userData.weight || "");
            setHorasSueno(userData.averageHoursSleep || "0");
            setNivelGlucosa(userData.averageGlucoseLevel || "0");
            setCarbIngeridos(userData.averageCarbohydrate || "0");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = doc(firestore, "users", user.uid);
        await updateDoc(userDoc, {
          height: altura,
          weight: peso,
        });
        setUpdateMessage("Datos actualizados correctamente");
      } else {
        setUpdateMessage("Error: Usuario no autenticado");
      }
    } catch (error) {
      setUpdateMessage("Error al actualizar los datos");
      console.error("Error al actualizar los datos:", error);
    } finally {
      setShowUpdateModal(true); // Mostrar modal de resultado
      setShowModal(false); // Cerrar el modal de edición
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="gray.100">
        <Box bg="teal.600" p={6} rounded="lg" width="90%" maxW="300px" mb={6}>
          <VStack space={3}>
            <Text fontSize="xl" bold color="white" textAlign="center">
              {name || "Perfil de Usuario"}
            </Text>
            <Text color="white">Correo: {correo || ""}</Text>
            <Text color="white">Altura: {altura || ""} cm</Text>
            <Text color="white">Peso: {peso || ""} kg</Text>
            <Text color="white">Horas de sueño: {horasSueno || ""} hrs</Text>
            <Text color="white">Glucosa: {nivelGlucosa || ""} mg/dL</Text>
            <Text color="white">Carbohidratos: {carbIngeridos || ""} g</Text>
          </VStack>
        </Box>

        <Button
          onPress={() => setShowModal(true)}
          bg="teal.700"
          _text={{ color: "white" }}
          mb={3}
          width="80%"
        >
          Editar Perfil
        </Button>

        <Button
          onPress={handleLogout}
          bg="red.600"
          _text={{ color: "white" }}
          width="80%"
        >
          Cerrar sesión
        </Button>

        {/* Modal de edición */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Editar Perfil</Modal.Header>
            <Modal.Body>
              <VStack space={4}>
                <FormControl>
                  <FormControl.Label>Correo Electrónico</FormControl.Label>
                  <Input
                    value={correo}
                    isDisabled={true}
                    bg="gray.200"
                    InputLeftElement={<Icon as={<MaterialIcons name="email" />} size={5} ml="2" color="muted.400" />}
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Altura (cm)</FormControl.Label>
                  <Input
                    value={altura}
                    onChangeText={setAltura}
                    bg="gray.100"
                    InputLeftElement={<Icon as={<MaterialIcons name="height" />} size={5} ml="2" color="muted.400" />}
                    placeholder="cm"
                    keyboardType="numeric"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Peso (kg)</FormControl.Label>
                  <Input
                    value={peso}
                    onChangeText={setPeso}
                    bg="gray.100"
                    InputLeftElement={<Icon as={<MaterialIcons name="fitness-center" />} size={5} ml="2" color="muted.400" />}
                    placeholder="kg"
                    keyboardType="numeric"
                  />
                </FormControl>

                <Button onPress={handleSaveChanges} bg="teal.700" _text={{ color: "white" }} mt={4}>
                  Guardar Cambios
                </Button>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        {/* Modal de confirmación de actualización */}
        <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Actualización</Modal.Header>
            <Modal.Body>
              <Text>{updateMessage}</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => setShowUpdateModal(false)} bg="teal.700" _text={{ color: "white" }}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </NativeBaseProvider>
  );
};

export default ProfileScreen;
