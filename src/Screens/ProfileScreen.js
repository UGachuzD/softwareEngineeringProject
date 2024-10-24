import { NativeBaseProvider, Button, Text, Center, Input } from 'native-base';


// Cuarto componente de la pantalla
const ProfileScreen = () => {
    return (
      <Center flex={1}>
        <Input variant="outline" placeholder="Nivel de glucosa" />
        <Button onPress={() => console.log("Profile Button!")}>Profile Button</Button>
      </Center>
    );
  };

export default ProfileScreen;