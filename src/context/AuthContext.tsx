import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiSignIn } from '../services/AuthService';

interface AuthData {
  token: string | null;
  rol: string | null;
  nombre: string | null;
  email: string | null;
  puntos: number | null;
  isLoading: boolean;
}

interface AuthContextType {
  authData?: AuthData;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  addFakePoints: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'userToken';
const ROL_KEY = 'userRol';
const NOMBRE_KEY = 'userName';
const EMAIL_KEY = 'userEmail';
const PUNTOS_KEY = 'userPuntos';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData>({
    token: null,
    rol: null,
    nombre: null,
    email: null,
    puntos: 0,
    isLoading: true,
  });

  useEffect(() => {
    const loadTokenFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedRol = await AsyncStorage.getItem(ROL_KEY);
        const storedNombre = await AsyncStorage.getItem(NOMBRE_KEY);
        const storedEmail = await AsyncStorage.getItem(EMAIL_KEY);
        const storedPuntos = await AsyncStorage.getItem(PUNTOS_KEY);
        if (storedToken && storedRol) {
          setAuthData({
            token: storedToken,
            rol: storedRol,
            nombre: storedNombre,
            email: storedEmail,
            puntos: storedPuntos ? parseInt(storedPuntos, 10) : 1250,
            isLoading: false,
          });
        } else {
          setAuthData({
            token: null,
            rol: null,
            nombre: null,
            email: null,
            puntos: 0,
            isLoading: false,
          });
        }
      } catch (e) {
        setAuthData({
          token: null,
          rol: null,
          nombre: null,
          email: null,
          puntos: 0,
          isLoading: false,
        });
      }
    };

    loadTokenFromStorage();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiSignIn(email, password);

      if (response.success && response.data) {
        const token = response.data.access;
        const rol = response.data.rol;
        const nombre = response.data.nombreCompleto || 'Usuario';
        const email = response.data.email || '';
        const puntos = 1250;

        setAuthData({
          token: token,
          rol: rol,
          nombre: nombre,
          email: email,
          puntos: puntos,
          isLoading: false,
        });

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(ROL_KEY, rol);
        await AsyncStorage.setItem(NOMBRE_KEY, nombre);
        await AsyncStorage.setItem(EMAIL_KEY, email);
        await AsyncStorage.setItem(PUNTOS_KEY, puntos.toString());

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Error de red' };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove([
        TOKEN_KEY,
        ROL_KEY,
        NOMBRE_KEY,
        EMAIL_KEY,
        PUNTOS_KEY,
      ]);
    } catch (e) {
      console.error('Error al borrar datos de Auth de AsyncStorage', e);
    }

    setAuthData({
      token: null,
      rol: null,
      nombre: null,
      email: null,
      puntos: 0,
      isLoading: false,
    });
  };

  const addFakePoints = async (amount: number) => {
    if (!authData) return;
    const newPoints = (authData.puntos || 0) + amount;

    setAuthData(prevData => ({
      ...prevData,
      puntos: newPoints,
    }));

    await AsyncStorage.setItem(PUNTOS_KEY, newPoints.toString());
  };

  return (
    <AuthContext.Provider value={{ authData, signIn, signOut, addFakePoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};