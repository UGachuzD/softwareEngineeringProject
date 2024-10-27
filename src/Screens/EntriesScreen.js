import React, { useState } from 'react';
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
  ScrollView,
} from 'native-base';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const EntriesScreen = () => {
  const [NivelGlucosa, setNivelGlucosa] = useState('');
  const [CarbIngeridos, setCarbIngeridos] = useState('');
  const [UnidadesInsulina, setUnidadesInsulina] = useState('');
  const [UnidadesCorrecion, setUnidadesCorrecion] = useState('');
  const [Hora, setHora] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [RitmoCardiaco, setRitmoCardiaco] = useState('');
  const [CaloriasQuemadas, setCaloriasQuemadas] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const db = getFirestore();
  const auth = getAuth();

  const cleanForm = () => {
    setNivelGlucosa('');
    setCarbIngeridos('');
    setUnidadesInsulina('');
    setUnidadesCorrecion('');
    setHora('');
    setRitmoCardiaco('');
    setCaloriasQuemadas('');
  };

  const handleAddEntry = async () => {
    const user = auth.currentUser;

    if (user) {
      const entryData = {
        userId: user.uid,
        NivelGlucosa,
        CarbIngeridos,
        UnidadesInsulina,
        UnidadesCorrecion,
        RitmoCardiaco,
        CaloriasQuemadas,
        Hora,
        createdAt: new Date()
      };

      try {
        await addDoc(collection(db, 'entries'), entryData);
        setModalMessage('Entrada añadida correctamente');
      } catch (error) {
        setModalMessage('Error al añadir la entrada');
        console.error('Error al añadir la entrada: ', error);
      }
      setShowModal(true);
      cleanForm();
    } else {
      setModalMessage('No hay un usuario autenticado.');
      setShowModal(true);
      cleanForm();
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convertir al formato de 12 horas
      const adjustedHours = hours % 12 || 12;
      setHora(`${adjustedHours.toString().padStart(2, '0')}:${minutes} ${ampm}`);
    }
    setShowTimePicker(false);
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="gray.100">
        <Box p={6} rounded="lg" width="100%" maxW="450px">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <VStack space={3}>
              <Text fontSize="xl" bold color="black" textAlign="center">
                Nueva Entrada
              </Text>

              <FormControl>
                <FormControl.Label _text={{ color: 'black' }}>Nivel de glucosa</FormControl.Label>
                <Input
                  value={NivelGlucosa}
                  onChangeText={setNivelGlucosa}
                  bg="white"
                  placeholder="mg/dL"
                  keyboardType="numeric"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ color: 'black' }}>Carbohidratos a consumir</FormControl.Label>
                <Input
                  value={CarbIngeridos}
                  onChangeText={setCarbIngeridos}
                  bg="white"
                  placeholder="g"
                  keyboardType="numeric"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ color: 'black' }}>Unidades de insulina</FormControl.Label>
                <Input
                  value={UnidadesInsulina}
                  onChangeText={setUnidadesInsulina}
                  bg="white"
                  placeholder="UI"
                  keyboardType="numeric"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ color: 'black' }}>Unidades de corrección</FormControl.Label>
                <Input
                  value={UnidadesCorrecion}
                  onChangeText={setUnidadesCorrecion}
                  bg="white"
                  placeholder="UI"
                  keyboardType="numeric"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ color: 'black' }}>Hora</FormControl.Label>
                <Input
                  value={Hora}
                  onFocus={() => setShowTimePicker(true)}
                  bg="white"
                  placeholder="hh:mm AM/PM"
                />
              </FormControl>

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}

              <FormControl>
                <FormControl.Label _text={{ color: 'black' }}>Ritmo cardiaco</FormControl.Label>
                <Input
                  value={RitmoCardiaco}
                  onChangeText={setRitmoCardiaco}
                  bg="white"
                  placeholder="bpm"
                  keyboardType="numeric"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ color: 'black' }}>Calorías quemadas</FormControl.Label>
                <Input
                  value={CaloriasQuemadas}
                  onChangeText={setCaloriasQuemadas}
                  bg="white"
                  placeholder="kcal"
                  keyboardType="numeric"
                />
              </FormControl>

              <Button onPress={handleAddEntry} bg="teal.700" _text={{ color: 'white' }}>
                Añadir Entrada
              </Button>
            </VStack>
          </ScrollView>
        </Box>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>¡Muy bien!</Modal.Header>
            <Modal.Body>
              <Text>{modalMessage}</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => setShowModal(false)} bg="teal.700" _text={{ color: 'white' }}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </NativeBaseProvider>
  );
};

export default EntriesScreen;
