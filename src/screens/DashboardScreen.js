import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Center, Image, Text, ScrollView, VStack } from 'native-base';
import axios from 'axios';
import { Alert } from 'react-native';
import { IPHOSTLOCAL } from "@env";

const DashboardScreen = () => {
  const [csvData, setCsvData] = useState([]);

  // Define los límites de glucosa
  const hipoThreshold = 70;  // Límite inferior para hipo
  const hiperThreshold = 180; // Límite superior para hiper

  // Función para obtener el contenido del CSV al cargar la pantalla
  const fetchCsvData = async () => {
    try {
      const response = await axios.get(`${IPHOSTLOCAL}/api/get-csv-content`); // Cambiar la IP
      const csvContent = response.data.content;
      const csvRows = csvContent.split('\n').map(row => row.split(','));
      setCsvData(csvRows);

      // Analiza los datos del CSV
      analyzeGlucoseData(csvRows);
    } catch (error) {
      console.error("Error al obtener el CSV:", error);
      Alert.alert('Error', 'No se pudo cargar el contenido del CSV.');
    }
  };

  // Función para analizar los datos de glucosa y mostrar notificaciones
  const analyzeGlucoseData = (data) => {
    data.forEach(row => {
      const date = row[0]; // Suponiendo que la fecha está en la primera columna
      const glucoseValue = parseFloat(row[1]); // Suponiendo que el valor de glucosa está en la segunda columna

      if (isNaN(glucoseValue)) return; // Si el valor no es un número, salta a la siguiente fila

      // Verifica si hay hipo o hiper
      if (glucoseValue < hipoThreshold) {
        Alert.alert('Hipoglucemia detectada', `Fecha: ${date}, Glucosa: ${glucoseValue} mg/dL`);
      } else if (glucoseValue > hiperThreshold) {
        Alert.alert('Hiperglucemia detectada', `Fecha: ${date}, Glucosa: ${glucoseValue} mg/dL`);
      }
    });
  };

  // Ejecuta las funciones al cargar el componente
  useEffect(() => {
    fetchCsvData();
  }, []);

  // Cambia la ruta de la imagen aquí, usando require para imágenes locales
  const imageUrl = require('../../BackEnd/salida.jpg'); // Asegúrate de que la ruta sea correcta

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="gray.100">
        <Text fontSize="xl" mb={4}>Resultados del Modelo</Text>
        <Image source={imageUrl} alt="Gráfica de glucosa" size="2xl" mb={4} />

        <ScrollView bg="white" p={4} rounded="lg" shadow={1} width="90%" maxHeight={200} mt={4}>
          <Text fontSize="lg" bold color="black" mb={2}>
            Contenido del CSV
          </Text>
          <VStack space={2}>
            {csvData.length > 0 ? (
              csvData.map((row, index) => (
                <Text key={index} color="gray.700">{row.join(', ')}</Text>
              ))
            ) : (
              <Text color="gray.500">No se pudo cargar el contenido del CSV.</Text>
            )}
          </VStack>
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  );
};

export default DashboardScreen;
