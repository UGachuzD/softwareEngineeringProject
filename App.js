import React from 'react';
import { NativeBaseProvider, Button, Box, Text, Center } from 'native-base';

const App = () => {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Box>
          <Text fontSize="lg" mb={4}>Prueba</Text>
          <Button onPress={() => console.log("Sherman!")}>Peabody</Button>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}

export default App;
