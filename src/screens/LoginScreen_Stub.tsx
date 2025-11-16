// src/screens/LoginScreen_Stub.tsx

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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = () => {
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
      // ¡YA NO NECESITAMOS EL ALERT!
      // El App.tsx se encargará de la navegación automáticamente.
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
              placeholder="********"
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
    height: 100,
  },
  titleLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  titleLogo: {
    width: '70%',
    height: 60,
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
});

export default LoginScreen;