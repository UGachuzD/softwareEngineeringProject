import React, { useState } from 'react';
import { NativeBaseProvider, Button, Box, Center, HStack, VStack, Text, Modal } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReportScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [format, setFormat] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleGenerateReport = () => {
    console.log(`Formato seleccionado: ${format}, Fecha seleccionada: ${selectedDate}`);
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="palegreen">
        {}
        <HStack space={3} mb={5}>
          <Button bg={format === 'PDF' ? 'black' : 'white'} onPress={() => setFormat('PDF')}>
            <Text color={format === 'PDF' ? 'white' : 'black'}>PDF</Text>
          </Button>
          <Button bg={format === 'JPG' ? 'black' : 'white'} onPress={() => setFormat('JPG')}>
            <Text color={format === 'JPG' ? 'white' : 'black'}>JPG</Text>
          </Button>
          <Button bg={format === 'PNG' ? 'black' : 'white'} onPress={() => setFormat('PNG')}>
            <Text color={format === 'PNG' ? 'white' : 'black'}>PNG</Text>
          </Button>
        </HStack>

        {/* Selector de fecha */}
        <Box bg="green.500" p={4} rounded="lg" width="90%" maxW="300px">
          <VStack space={3}>
            <Text fontSize="lg">Seleccionar Fecha</Text>
            <Button onPress={() => setShowModal(true)}>
              <Text fontSize="xl">{selectedDate.toDateString()}</Text>
            </Button>

            <Button onPress={handleGenerateReport} bg="black">
              Generar Reporte
            </Button>
          </VStack>
        </Box>

        {/* Modal para el selector de fecha */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Seleccione una Fecha</Modal.Header>
            <Modal.Body>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="white" onPress={() => setShowModal(false)}>
                  Cancelar
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </NativeBaseProvider>
  );
};

export default ReportScreen;
