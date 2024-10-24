import { NativeBaseProvider, Button, Text, Center } from 'native-base';

const ModelScreen = () => {
    return (
      <Center flex={1}>
        <Text fontSize="lg" mb={4}>Model</Text>
        <Button onPress={() => console.log("Model Button!")}>Model Button</Button>
      </Center>
    );
  };

export default ModelScreen;