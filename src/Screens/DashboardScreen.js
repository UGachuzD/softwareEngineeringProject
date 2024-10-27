import { NativeBaseProvider, Button, Text, Center } from 'native-base';

const DashboardScreen = () => {
    return (
      <Center flex={1}>
        <Text fontSize="lg" mb={4}>Home</Text>
        <Button onPress={() => console.log("Home Button!")}>Home Button</Button>
      </Center>
    );
  };

export default DashboardScreen;