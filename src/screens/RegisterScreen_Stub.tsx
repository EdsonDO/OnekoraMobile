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
import { register, RegisterData } from '../services/AuthService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telf, setTelf] = useState('');
  const [direccion, setDireccion] = useState('');
  const [sector, setSector] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isPassword2Secure, setIsPassword2Secure] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (
      !username ||
      !email ||
      !firstName ||
      !lastName ||
      !password ||
      !password2
    ) {
      setError('Los campos de usuario, correo, nombre y contraseña son obligatorios.');
      return;
    }
    if (password !== password2) {
      setError('Las contraseñas deben coincidir.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const registerData: RegisterData = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      password2,
      telf: telf || '',
      direccion: direccion || '',
      sector: sector || '',
    };

    const response = await register(registerData);

    setIsLoading(false);

    if (response.success) {
      Alert.alert(
        'Registro Exitoso!',
        'Tu cuenta ha sido creada. Ahora puedes iniciar sesión. Bienvenido a Onekora.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } else {
      setError(response.error || 'Ocurrió un error desconocido.');
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
              source={require('../assets/images/createaccountasset.png')}
              style={styles.createAccountImage} 
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            
            <Text style={styles.label}>Nombre de Usuario:</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduzca su nombre de usuario"
              placeholderTextColor={palette.textoSecundario}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <Text style={styles.label}>Correo Electrónico:</Text>
            <TextInput
              style={styles.input}
              placeholder="usuario@correo.com"
              placeholderTextColor={palette.textoSecundario}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Nombres:</Text>
            <TextInput
              style={styles.input}
              placeholder="Tus nombres"
              placeholderTextColor={palette.textoSecundario}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            
            <Text style={styles.label}>Apellidos:</Text>
            <TextInput
              style={styles.input}
              placeholder="Tus apellidos"
              placeholderTextColor={palette.textoSecundario}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Celular (Opcional):</Text>
            <TextInput
              style={styles.input}
              placeholder="987654321"
              placeholderTextColor={palette.textoSecundario}
              value={telf}
              onChangeText={setTelf}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.label}>Dirección (Opcional):</Text>
            <TextInput
              style={styles.input}
              placeholder="Jr. Dos de Mayo #123"
              placeholderTextColor={palette.textoSecundario}
              value={direccion}
              onChangeText={setDireccion}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Sector (Opcional):</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sector}
                onValueChange={(itemValue) => setSector(itemValue)}
                style={styles.picker}
                dropdownIconColor={palette.textoPrimario}
              >
                <Picker.Item label="Seleccione su sector..." value="" style={styles.pickerItem} />
                <Picker.Item label="Huánuco (Centro)" value="Centro" style={styles.pickerItem} />
                <Picker.Item label="Pillco Marca" value="Pillco Marca" style={styles.pickerItem} />
                <Picker.Item label="Amarilis" value="Amarilis" style={styles.pickerItem} />
                <Picker.Item label="La Esperanza" value="La Esperanza" style={styles.pickerItem} />
                <Picker.Item label="Paucarbamba" value="Paucarbamba" style={styles.pickerItem} />
                <Picker.Item label="Otro" value="Otro" style={styles.pickerItem} />
              </Picker>
            </View>

            <Text style={styles.label}>Contraseña:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Ingrese su contraseña..."
                placeholderTextColor={palette.textoSecundario}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isPasswordSecure}
              />
              <TouchableOpacity 
                onPress={() => setIsPasswordSecure(!isPasswordSecure)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={isPasswordSecure ? 'eye-off-outline' : 'eye-outline'} 
                  size={24} 
                  color={palette.textoSecundario} 
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar Contraseña:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Confirme contraseña..."
                placeholderTextColor={palette.textoSecundario}
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry={isPassword2Secure}
              />
              <TouchableOpacity 
                onPress={() => setIsPassword2Secure(!isPassword2Secure)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={isPassword2Secure ? 'eye-off-outline' : 'eye-outline'} 
                  size={24} 
                  color={palette.textoSecundario} 
                />
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.botonRegistrar} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color={palette.blanco} />
              ) : (
                <Text style={styles.botonRegistrarTexto}>Registrarse</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginButtonText}>
                ¿Ya tienes una cuenta? <Text style={styles.loginLink}>Inicie sesión aquí</Text>
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

  createAccountImage: {
    width: '90%', 
    height: 80,   
    marginBottom: 30, 
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    textAlign: 'center',
    marginBottom: 30,
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
  pickerContainer: {
    backgroundColor: palette.blanco,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    color: palette.textoPrimario,
    height: 50,
    width: '100%',
  },
  pickerItem: {
    backgroundColor: palette.blanco,
    color: palette.textoPrimario,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.blanco,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    borderRadius: 16,
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: palette.textoPrimario,
  },
  eyeIcon: {
    padding: 10,
    paddingRight: 15,
  },
  botonRegistrar: { 
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
  botonRegistrarTexto: { 
    color: palette.blanco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: { 
    marginTop: 25,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 14,
    color: palette.textoSecundario,
  },
  loginLink: { 
    color: palette.verdePrimario,
    fontWeight: 'bold',
  },
  errorText: {
    color: palette.error,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;