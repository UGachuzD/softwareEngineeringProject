import { NativeBaseProvider, Button, Text, Center } from 'native-base';

// Tercer componente de la pantalla
const ReportScreen = () => {
    return (
      <Center flex={1}>
        <Text fontSize="lg" mb={4}>Reports</Text>
        <Button onPress={() => console.log("Reports Button!")}>Reports Button</Button>
      </Center>
    );
  };

export default ReportScreen;