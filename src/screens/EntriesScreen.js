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
  const [RitmoCardiaco, setRitmoCardiaco] = useState('');
  const [CaloriasQuemadas, setCaloriasQuemadas] = useState('');
  const [Fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const db = getFirestore();
  const auth = getAuth();

  const cleanForm = () => {
    setNivelGlucosa('');
    setCarbIngeridos('');
    setUnidadesInsulina('');
    setUnidadesCorrecion('');
    setRitmoCardiaco('');
    setCaloriasQuemadas('');
    setFecha(new Date());
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
        Fecha,
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

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setFecha(selectedDate);
    }
    setShowDatePicker(false);
  };

  // Formato de fecha en YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses comienzan en 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
                <FormControl.Label _text={{ color: 'black' }}>Fecha</FormControl.Label>
                <Input
                  value={formatDate(Fecha)}
                  onFocus={() => setShowDatePicker(true)}
                  bg="white"
                  placeholder="AAAA-MM-DD"
                  editable={false}
                />
              </FormControl>

              {showDatePicker && (
                <DateTimePicker
                  value={Fecha}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
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
