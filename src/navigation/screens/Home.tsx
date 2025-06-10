import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View, Image } from 'react-native';
import { VStack, Heading } from "@gluestack-ui/themed";

import holaImage from '../assets/images/hola.webp';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <VStack space="lg" alignItems="center">
        <Heading size="2xl">Bienvenido a Episodios</Heading>
        <Text style={styles.subtitle}>
          Gestiona tus episodios favoritos de manera sencilla
        </Text>
        <Image source={holaImage} style={styles.image} />
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default HomeScreen;
