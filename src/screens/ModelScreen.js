import React, { useState } from 'react';
import {
  NativeBaseProvider,
  Box,
  Button,
  Center,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Alert, ActivityIndicator } from 'react-native';
import { IPHOSTLOCAL } from "@env";
import { getAuth } from 'firebase/auth';

const App = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [fileInfo, setFileInfo] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`${IPHOSTLOCAL}/api/${endpoint}/${user.uid}`, {
        timeout: 10000,
      });
      Alert.alert('Success', response.data.message);
    } catch (error) {
      console.error(error);
      const message = error.response ? error.response.data.message : 'Error de conexión';
      Alert.alert('Error', message);
    }
  };

  const handleTrainModel = async () => {
    setLoading(true);
    await fetchData('train-model');
    setLoading(false);
  };

  const selectAndUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (!result.canceled) {
        const file = result.assets[0];
        setCsvFile({
          uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
          name: file.name,
          type: file.mimeType,
        });

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        });

        const response = await axios.post(`${IPHOSTLOCAL}/api/upload-csv/${user.uid}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        Alert.alert('Success', response.data.message);
        setFileInfo(`Archivo: ${file.name}\nTipo: ${file.mimeType}\nTamaño: ${file.size} bytes`);

        const content = await FileSystem.readAsStringAsync(file.uri);
        setFileContent(content.split('\n').slice(0, 5).join('\n'));
      } else {
        Alert.alert('No file selected');
      }
    } catch (error) {
      console.error("Error al seleccionar o subir el archivo:", error);
      Alert.alert('Error al seleccionar o subir el archivo');
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="gray.100">
        <Button onPress={selectAndUploadFile} bg="teal.700" _text={{ color: "white" }} mb={4}>
          Seleccionar y Subir CSV
        </Button>
        <Button onPress={handleTrainModel} bg="teal.700" _text={{ color: "white" }} mb={4} disabled={loading}>
          Entrenar Modelo
        </Button>
        {loading && <ActivityIndicator size="large" color="teal" />}

        <Box bg="white" p={4} rounded="lg" shadow={1} width="90%">
          <Text fontSize="lg" bold color="black" textAlign="center" mb={2}>
            Información del Archivo
          </Text>
          <Text color="gray.600">{fileInfo}</Text>
        </Box>

        <ScrollView bg="white" p={4} rounded="lg" shadow={1} width="90%" maxHeight={200} mt={4}>
          <Text fontSize="lg" bold color="black" mb={2}>
            Contenido del CSV
          </Text>
          <VStack space={2}>
            {fileContent ? (
              fileContent.split('\n').map((line, index) => (
                <Text key={index} color="gray.700">{line}</Text>
              ))
            ) : (
              <Text color="gray.500">Contenido del archivo aparecerá aquí...</Text>
            )}
          </VStack>
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  );
};

export default App;
