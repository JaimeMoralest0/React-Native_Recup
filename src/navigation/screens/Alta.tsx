import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  Input,
  InputField,
  Button,
  ButtonText,
  Alert,
  AlertText,
  AlertIcon,
} from "@gluestack-ui/themed";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const API_URL = 'http://localhost:3000/api';

const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors' as RequestMode,
};

function AltaScreen() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [datos, setDatos] = useState({
    titulo: "",
    descripcion: "",
    fecha_emision: "",
    temporada: "",
    numero_episodio: "",
    duracion_minutos: "",
  });

  const [datosValidos, setDatosValidos] = useState({
    titulo: false,
    descripcion: false,
    fecha_emision: false,
    temporada: false,
    numero_episodio: false,
    duracion_minutos: false,
  });

  const handleSubmit = async () => {
    if (validarDatos()) {
      try {
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const response = await fetch(`${API_URL}/episodios`, {
          ...fetchOptions,
          method: "POST",
          body: JSON.stringify({
            ...datos,
            temporada: parseInt(datos.temporada),
            numero_episodio: parseInt(datos.numero_episodio),
            duracion_minutos: parseInt(datos.duracion_minutos),
            id_serie: 1, // ← Valor fijo
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const respuesta = await response.json();
        
        if (respuesta.ok) {
          setSuccess("Episodio creado correctamente");
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        } else {
          setError(respuesta.mensaje || "Error al crear el episodio");
        }
      } catch (error) {
        console.error("Error:", error);
        setError(
          "Error al conectar con el servidor. Por favor, verifica que:\n\n" +
          "1. El servidor esté corriendo en el puerto 3000\n" +
          "2. El servidor tenga habilitado CORS\n" +
          "3. La conexión a internet esté activa"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validarDatos = () => {
    const esTexto = (v: string) => v.trim() !== "";
    const esNumero = (v: string) => !isNaN(Number(v)) && v.trim() !== "";

    const validos = {
      titulo: esTexto(datos.titulo),
      descripcion: esTexto(datos.descripcion),
      fecha_emision: esTexto(datos.fecha_emision),
      temporada: esNumero(datos.temporada),
      numero_episodio: esNumero(datos.numero_episodio),
      duracion_minutos: esNumero(datos.duracion_minutos),
    };

    setDatosValidos({
      titulo: !validos.titulo,
      descripcion: !validos.descripcion,
      fecha_emision: !validos.fecha_emision,
      temporada: !validos.temporada,
      numero_episodio: !validos.numero_episodio,
      duracion_minutos: !validos.duracion_minutos,
    });

    return Object.values(validos).every(Boolean);
  };

  const renderCampo = (
    label: string,
    key: keyof typeof datos,
    placeholder: string,
    isNumeric = false
  ) => (
    <FormControl isInvalid={datosValidos[key]} isRequired>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField
          placeholder={placeholder}
          value={datos[key]}
          onChangeText={(text: string) => setDatos({ ...datos, [key]: text })}
          editable={!isSubmitting}
        />
      </Input>
      {datosValidos[key] && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircle} />
          <FormControlErrorText>
            {isNumeric
              ? `${label} debe ser un número`
              : `${label} es obligatorio`}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );

  return (
    <VStack
      space="md"
      p="$4"
      borderWidth={1}
      borderRadius="$lg"
      borderColor="$borderLight300"
      bg="$backgroundLight0"
      width="100%"
      maxWidth={400}
      alignSelf="center"
      mt="$4"
    >
      {error && (
        <Alert action="error" variant="solid">
          <AlertIcon as={AlertCircle} />
          <AlertText>{error}</AlertText>
        </Alert>
      )}

      {success && (
        <Alert action="success" variant="solid">
          <AlertIcon as={CheckCircle2} />
          <AlertText>{success}</AlertText>
        </Alert>
      )}

      {renderCampo("Título", "titulo", "Título del episodio")}
      {renderCampo("Descripción", "descripcion", "Descripción del episodio")}
      {renderCampo("Fecha de emisión", "fecha_emision", "YYYY-MM-DD")}
      {renderCampo("Temporada", "temporada", "Ej: 1", true)}
      {renderCampo("Número de episodio", "numero_episodio", "Ej: 5", true)}
      {renderCampo("Duración (minutos)", "duracion_minutos", "Ej: 42", true)}

      <FormControl isRequired isDisabled>
        <FormControlLabel>
          <FormControlLabelText>ID de serie</FormControlLabelText>
        </FormControlLabel>
        <Input isDisabled>
          <InputField value="1" />
        </Input>
      </FormControl>

      <Button 
        onPress={handleSubmit} 
        mt="$4"
        isDisabled={isSubmitting}
      >
        <ButtonText>
          {isSubmitting ? "Guardando..." : "Aceptar"}
        </ButtonText>
      </Button>
    </VStack>
  );
}

export default AltaScreen;
