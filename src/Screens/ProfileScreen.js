import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, VStack, Center, FormControl, Modal, Text } from 'native-base';

const ProfileScreen = () => {
  const [correo, setCorreo] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [horasSueno, setHorasSueno] = useState('');
  const [nivelGlucosa, setNivelGlucosa] = useState('');
  const [carbIngeridos, setCarbIngeridos] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSaveChanges = () => {
    console.log('Cambios guardados:', {
      correo,
      altura,
      peso,
      horasSueno,
      nivelGlucosa,
      carbIngeridos,
    });
    setShowModal(false);
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="palegreen">
        {/* Box para mostrar datos del usuario */}
        <Box bg="green.500" p={4} rounded="lg" width="90%" maxW="300px" mb={4}>
          <VStack space={2}>
            <Text fontSize="lg">Datos del Usuario:</Text>
            <Text>Correo: {correo || 'ejemplo@correo.com'}</Text>
            <Text>Altura: {altura || '170 cm'}</Text>
            <Text>Peso: {peso || '70 kg'}</Text>
            <Text>Horas de sueño promedio: {horasSueno || '8 horas'}</Text>
            <Text>Nivel de glucosa promedio: {nivelGlucosa || '90 mg/dL'}</Text>
            <Text>Carbohidratos ingeridos promedio: {carbIngeridos || '200 g'}</Text>
          </VStack>
        </Box>

        {/* Botón para abrir el modal de perfil */}
        <Button onPress={() => setShowModal(true)} bg="black">
          Editar Perfil
        </Button>

        {/* Modal para editar perfil */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Editar Perfil</Modal.Header>
            <Modal.Body>
              <Box bg="green.500" p={5} rounded="lg">
                <VStack space={4}>
                  {/* Campo de correo */}
                  <FormControl>
                    <FormControl.Label>Correo electrónico</FormControl.Label>
                    <Input
                      value={correo}
                      onChangeText={setCorreo}
                      bg="white"
                      placeholder='ejemplo@correo.com'
                    />
                  </FormControl>

                  {/* Campo de altura */}
                  <FormControl>
                    <FormControl.Label>Altura (cm)</FormControl.Label>
                    <Input
                      value={altura}
                      onChangeText={setAltura}
                      bg="white"
                      placeholder='cm'
                    />
                  </FormControl>

                  {/* Campo de peso */}
                  <FormControl>
                    <FormControl.Label>Peso (kg)</FormControl.Label>
                    <Input
                      value={peso}
                      onChangeText={setPeso}
                      bg="white"
                      placeholder='kg'
                    />
                  </FormControl>

                  {/* Campo de horas de sueño promedio */}
                  <FormControl>
                    <FormControl.Label>Horas de sueño promedio</FormControl.Label>
                    <Input
                      value={horasSueno}
                      onChangeText={setHorasSueno}
                      bg="white"
                      placeholder='horas'
                    />
                  </FormControl>

                  {/* Campo de nivel de glucosa promedio */}
                  <FormControl>
                    <FormControl.Label>Nivel de glucosa promedio</FormControl.Label>
                    <Input
                      value={nivelGlucosa}
                      onChangeText={setNivelGlucosa}
                      bg="white"
                      placeholder='mg/dL'
                    />
                  </FormControl>

                  {/* Campo de carbohidratos ingeridos promedio */}
                  <FormControl>
                    <FormControl.Label>Carbohidratos ingeridos promedio</FormControl.Label>
                    <Input
                      value={carbIngeridos}
                      onChangeText={setCarbIngeridos}
                      bg="white"
                      placeholder='g'
                    />
                  </FormControl>

                  {/* Botón para guardar cambios */}
                  <Button onPress={handleSaveChanges} bg="black">
                    Guardar Cambios
                  </Button>
                </VStack>
              </Box>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </NativeBaseProvider>
  );
};

export default ProfileScreen;
