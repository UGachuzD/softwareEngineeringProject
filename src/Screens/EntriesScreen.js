import { NativeBaseProvider, Button, Text, Center } from 'native-base';

// Segundo componente de la pantalla
const EntriesScreen = () => {
    return (
      <Center flex={1}>
        <Text fontSize="lg" mb={4}>Settings</Text>
        <Button onPress={() => console.log("Settings Button!")}>Settings Button</Button>
      </Center>
    );
  };


export default EntriesScreen;