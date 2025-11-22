import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { palette } from '../theme/palette';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const onLoginPress = async () => {
    if (isLoading) return;
    
    if (!email || !password) {
      Alert.alert('Campos vacíos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);
    const response = await signIn(email, password);
    setIsLoading(false);

    if (response.success) {

    } else {
      Alert.alert('Error de Login', response.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      
      <Image
        source={require('../assets/images/logoOlitas.png')}
        style={styles.olitasBackground}
        resizeMode="cover"
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.mainLogoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.mainLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleLogoContainer}>
            <Image
              source={require('../assets/images/logoTitulo.png')}
              style={styles.titleLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Correo Electrónico:</Text>
            <TextInput
              style={styles.input}
              placeholder="usuario@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={palette.textoSecundario}
            />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña..."
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={palette.textoSecundario}
            />

            <TouchableOpacity style={styles.botonIngresar} onPress={onLoginPress} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color={palette.blanco} />
              ) : (
                <Text style={styles.botonIngresarTexto}>Ingresar</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerButtonText}>
                ¿No tienes una cuenta? <Text style={styles.registerLink}>Regístrate aquí</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.fondoApp,
  },
  keyboardView: {
    flex: 1,
  },
  olitasBackground: {
    position: 'absolute',
    left: -1, 
    width: 600,
    height: SCREEN_HEIGHT,
    opacity: 0.3, 
    resizeMode: 'cover', 
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  mainLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  mainLogo: {
    width: '60%',
    height: 170,
  },
  titleLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  titleLogo: {
    width: '70%',
    height: 90,
  },
  formContainer: {
    marginTop: 40,
    paddingBottom: 60,
  },
  label: {
    fontSize: 16,
    color: palette.textoPrimario,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: palette.blanco,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    color: palette.textoPrimario,
  },
  botonIngresar: {
    backgroundColor: palette.verdeOscuro,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botonIngresarTexto: {
    color: palette.blanco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 14,
    color: palette.textoSecundario,
  },
  registerLink: {
    color: palette.verdePrimario,
    fontWeight: 'bold',
  },
});

export default LoginScreen;


















/**
 * ============================================================================
 * AVISO DE PROPIEDAD INTELECTUAL
 * ============================================================================
 * * PROYECTO:        Onekora (Anteriormente "Huánuco Recicla")
 * DESARROLLADOR:   Dionicio Orihuela Edson Raul
 * AÑO:             2025
 * UBICACIÓN:       Huánuco, Perú
 *
 * ----------------------------------------------------------------------------
 * AUTORÍA
 * ----------------------------------------------------------------------------
 * Este código fuente, incluyendo la lógica de negocio, arquitectura de software
 * (Frontend y Backend), diseño de interfaces (UI), experiencia de usuario (UX),
 * activos gráficos y el rebranding de la identidad visual de la marca "Onekora",
 * ha sido desarrollado en su totalidad por Dionicio Orihuela Edson Raul.
 *
 * El autor certifica su autoría exclusiva sobre la obra completa, abarcando:
 * 1. Desarrollo FullStack (React Native / Django).
 * 2. Diseño Gráfico y Creativo.
 * 3. Ingeniería de Software y Base de Datos.
 *
 * ----------------------------------------------------------------------------
 * MARCO LEGAL
 * ----------------------------------------------------------------------------
 * Esta obra está protegida por las leyes de propiedad intelectual de la
 * República del Perú, específicamente bajo el DECRETO LEGISLATIVO Nº 822
 * (Ley sobre el Derecho de Autor) y sus modificatorias.
 *
 * Conforme al Artículo 22 de dicha ley, el autor reivindica su DERECHO MORAL
 * de paternidad sobre la obra, el cual es perpetuo, inalienable e imprescriptible.
 *
 * Queda terminantemente prohibida la reproducción total o parcial, distribución,
 * comunicación pública, transformación o ingeniería inversa de este software
 * sin la autorización previa y por escrito del titular de los derechos.
 *
 * Cualquier uso no autorizado de este código o de los elementos visuales
 * asociados constituirá una violación a los derechos de propiedad intelectual
 * y será sujeto a las acciones civiles y penales correspondientes ante el
 * INDECOPI y el Poder Judicial del Perú.
 *
 * ============================================================================
 */