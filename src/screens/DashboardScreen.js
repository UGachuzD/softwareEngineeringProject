import React, { useEffect, useState, useCallback } from 'react';
import { NativeBaseProvider, Center, Image, Text, ScrollView, VStack } from 'native-base';
import axios from 'axios';
import { Alert } from 'react-native';
import { IPHOSTLOCAL } from "@env";
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const DashboardScreen = () => {
  const [csvData, setCsvData] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const hipoThreshold = 70;
  const hiperThreshold = 180;

  const fetchCsvData = async () => {
    try {
      const response = await axios.get(`${IPHOSTLOCAL}/api/get-csv-content/${user.uid}`);
      const csvContent = response.data.content;
      const csvRows = csvContent.split('\n').map(row => row.split(','));
      setCsvData(csvRows);

      analyzeGlucoseData(csvRows);
    } catch (error) {
      console.error("Error al obtener el CSV:", error);
      Alert.alert('Error', 'No se pudo cargar el contenido del CSV.');
    }
  };

  const analyzeGlucoseData = (data) => {
    data.forEach(row => {
      const date = row[0];
      const glucoseValue = parseFloat(row[1]);

      if (isNaN(glucoseValue)) return;

      if (glucoseValue < hipoThreshold) {
        Alert.alert('Hipoglucemia detectada', `Fecha: ${date}, Glucosa: ${glucoseValue} mg/dL`);
      } else if (glucoseValue > hiperThreshold) {
        Alert.alert('Hiperglucemia detectada', `Fecha: ${date}, Glucosa: ${glucoseValue} mg/dL`);
      }
    });
  };

  const fetchImage = async () => {
    try {
      const response = await fetch(`${IPHOSTLOCAL}/api/get-image/${user.uid}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageUri(imageUrl);
      } else {
        const fallbackResponse = await fetch(`${IPHOSTLOCAL}/api/get-image/default`);
        if (fallbackResponse.ok) {
          const fallbackBlob = await fallbackResponse.blob();
          const fallbackImageUrl = URL.createObjectURL(fallbackBlob);
          setImageUri(fallbackImageUrl);
        } else {
          throw new Error("Error al obtener la imagen de respaldo.");
        }
      }
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
      Alert.alert('Error', 'No se pudo cargar la imagen.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCsvData();
      fetchImage();
    }, [])
  );

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="gray.100">
        <ScrollView>
          <Center>
            {imageUri ? (
              <Image source={{ uri: imageUri }} alt="Imagen de predicción" size="2xl" />
            ) : (
              <Text color="gray.500">Imagen no disponible</Text>
            )}
          </Center>

          <VStack space={2} mt={4}>
            {csvData.length > 0 ? (
              csvData.map((row, index) => (
                <Text key={index} color="gray.700">{row.join(', ')}</Text>
              ))
            ) : (
              <Text color="gray.500">Contenido del CSV aparecerá aquí...</Text>
            )}
          </VStack>
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  );
};

export default DashboardScreen;
