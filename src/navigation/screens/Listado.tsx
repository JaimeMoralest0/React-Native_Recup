import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Button, ButtonText, Text, VStack, HStack, Spinner } from "@gluestack-ui/themed";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

interface Episodio {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_emision: string;
  temporada: number;
  numero_episodio: number;
  duracion_minutos: number;
}

const API_URL = 'http://localhost:3000/api';

const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors' as RequestMode,
};

export function ListadoScreen() {
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const cargarEpisodios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando carga de episodios...');
      console.log('URL de la API:', `${API_URL}/episodios`);
      
      const response = await fetch(`${API_URL}/episodios`, {
        ...fetchOptions,
        method: 'GET',
      });
      
      console.log('Status de la respuesta:', response.status);
      console.log('Headers de la respuesta:', JSON.stringify(Object.fromEntries(response.headers.entries())));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', JSON.stringify(data, null, 2));

      // Validar que data tenga la estructura correcta
      if (!data || typeof data !== 'object' || !data.ok || !Array.isArray(data.datos)) {
        console.error('La respuesta no tiene el formato esperado:', data);
        throw new Error('Formato de respuesta inválido: se esperaba un objeto con {ok: boolean, datos: array}');
      }

      // Validar que cada elemento tenga la estructura correcta
      const episodiosValidos = data.datos.every((episodio: any) => {
        const tieneEstructuraCorrecta = 
          typeof episodio.id === 'number' &&
          typeof episodio.titulo === 'string' &&
          typeof episodio.descripcion === 'string' &&
          typeof episodio.fecha_emision === 'string' &&
          typeof episodio.temporada === 'number' &&
          typeof episodio.numero_episodio === 'number' &&
          typeof episodio.duracion_minutos === 'number';
        
        if (!tieneEstructuraCorrecta) {
          console.error('Episodio con estructura inválida:', episodio);
        }
        
        return tieneEstructuraCorrecta;
      });

      if (!episodiosValidos) {
        throw new Error('Algunos episodios tienen una estructura inválida');
      }

      setEpisodios(data.datos);
      console.log('Episodios cargados correctamente:', data.datos.length);
    } catch (error) {
      console.error("Error al cargar episodios:", error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setEpisodios([]); // Asegurarnos de que episodios sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  }, []);

  const borrarEpisodio = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/episodios/${id}`, {
        ...fetchOptions,
        method: "DELETE",
      });
      
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok && data?.ok) {
        // Actualizar el estado local directamente sin recargar toda la lista
        setEpisodios(episodiosActuales => 
          episodiosActuales.filter(episodio => episodio.id !== id)
        );
      }
    } catch (error) {
      console.error("Error al borrar episodio:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect: cargando episodios...');
      cargarEpisodios();
    }, [cargarEpisodios])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner size="large" />
        <Text mt="$4">Cargando episodios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: {error}
        </Text>
        <Button onPress={cargarEpisodios} mt="$4">
          <ButtonText>Reintentar</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <VStack space="md" width="100%" padding={16}>
          {!Array.isArray(episodios) || episodios.length === 0 ? (
            <Text style={styles.noEpisodios}>
              No hay episodios disponibles
            </Text>
          ) : (
            episodios.map((episodio) => (
              <Card key={episodio.id} variant="elevated" size="md">
                <VStack space="sm">
                  <Text size="lg" bold>{episodio.titulo}</Text>
                  <Text>{episodio.descripcion}</Text>
                  <HStack space="md">
                    <Text>Temporada: {episodio.temporada}</Text>
                    <Text>Episodio: {episodio.numero_episodio}</Text>
                  </HStack>
                  <Text>Duración: {episodio.duracion_minutos} minutos</Text>
                  <Text>Fecha: {episodio.fecha_emision}</Text>
                  <Button
                    onPress={() => borrarEpisodio(episodio.id)}
                    variant="solid"
                    action="negative"
                  >
                    <ButtonText>Eliminar</ButtonText>
                  </Button>
                </VStack>
              </Card>
            ))
          )}
        </VStack>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
  },
  noEpisodios: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default ListadoScreen; 