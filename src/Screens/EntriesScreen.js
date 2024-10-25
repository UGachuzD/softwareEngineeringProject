import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, VStack, Center, FormControl } from 'native-base';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const EntriesScreen = () => {
  const [NivelGlucosa, setNivelGlucosa] = useState('');
  const [CarbIngeridos, setCarbIngeridos] = useState('');
  const [RitmoCardiaco, setRitmoCardiaco] = useState('');
  const [CaloriasQuemadas, setCaloriasQuemadas] = useState('');

  const handleAddEntry = () => {
    console.log('Entrada añadida:', {
      NivelGlucosa,
      CarbIngeridos,
      RitmoCardiaco,
      CaloriasQuemadas,
    });
    // Aquí puedes manejar el envío de datos o guardarlos
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="palegreen"> {}
        <Box bg="green.500" p={5} rounded="lg" width="90%" maxW="300px">
          <VStack space={4}>
            {/* Nivel de glucosa */}
            <FormControl>
              <FormControl.Label>Nivel de glucosa</FormControl.Label>
              <Input
                value={NivelGlucosa}
                onChangeText={setNivelGlucosa}
                bg="white"
                placeholder='mg/dL'
              />
            </FormControl>

            {/* Carbohidratos ingeridos */}
            <FormControl>
              <FormControl.Label>Carbohidratos ingeridos</FormControl.Label>
              <Input
                value={CarbIngeridos}
                onChangeText={setCarbIngeridos}
                bg="white"
                placeholder='g'
              />
            </FormControl>

            {/* Ritmo cardiaco */}
            <FormControl>
              <FormControl.Label>Ritmo cardiaco</FormControl.Label>
              <Input
                value={RitmoCardiaco}
                onChangeText={setRitmoCardiaco}
                bg="white"
                placeholder='bpm'
              />
            </FormControl>

            {/* Calorías quemadas */}
            <FormControl>
              <FormControl.Label>Calorías quemadas</FormControl.Label>
              <Input
                value={CaloriasQuemadas}
                onChangeText={setCaloriasQuemadas}
                bg="white"
                placeholder='kcal'
              />
            </FormControl>

            {/* Botón para añadir entrada */}
            <Button onPress={handleAddEntry} bg="black">
              Añadir Entrada
            </Button>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default EntriesScreen;
