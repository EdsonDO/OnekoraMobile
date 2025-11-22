import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiSignIn } from '../services/AuthService';
import axios from 'axios';

// URL BASE para actualizar puntos (Asegúrate de que coincida con tu AuthService)
// SI USAS PYTHONANYWHERE: Cambia esto por 'https://edsondoes.pythonanywhere.com/api'
//const API_URL = 'http://10.0.2.2:8000/api'; 

const API_URL = 'https://edsondoes.pythonanywhere.com/api';

interface AuthData {
  token: string | null;
  rol: string | null;
  nombre: string | null;
  email: string | null;
  puntos: number | null;
  recolecciones: number | null;
  telf: string | null;
  direccion: string | null;
  sector: string | null;
  isLoading: boolean;
}

interface AuthContextType {
  authData?: AuthData;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  addFakePoints: (amount: number) => void;
  incrementRecolecciones: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'userToken';
const ROL_KEY = 'userRol';
const NOMBRE_KEY = 'userName';
const EMAIL_KEY = 'userEmail';
const PUNTOS_KEY = 'userPuntos';
const RECOLECCIONES_KEY = 'userRecolecciones';
const TELF_KEY = 'userTelf';
const DIRECCION_KEY = 'userDireccion';
const SECTOR_KEY = 'userSector';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData>({
    token: null,
    rol: null,
    nombre: null,
    email: null,
    puntos: 0,
    recolecciones: 0,
    telf: null,
    direccion: null,
    sector: null,
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
        const storedRecolecciones = await AsyncStorage.getItem(RECOLECCIONES_KEY);
        const storedTelf = await AsyncStorage.getItem(TELF_KEY);
        const storedDireccion = await AsyncStorage.getItem(DIRECCION_KEY);
        const storedSector = await AsyncStorage.getItem(SECTOR_KEY);

        if (storedToken && storedRol) {
          setAuthData({
            token: storedToken,
            rol: storedRol,
            nombre: storedNombre,
            email: storedEmail,
            puntos: storedPuntos ? parseInt(storedPuntos, 10) : 0,
            recolecciones: storedRecolecciones ? parseInt(storedRecolecciones, 10) : 0,
            telf: storedTelf,
            direccion: storedDireccion,
            sector: storedSector,
            isLoading: false,
          });
        } else {
          setAuthData({
            token: null,
            rol: null,
            nombre: null,
            email: null,
            puntos: 0,
            recolecciones: 0,
            telf: null,
            direccion: null,
            sector: null,
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
          recolecciones: 0,
          telf: null,
          direccion: null,
          sector: null,
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
        const puntos = response.data.puntos || 0;
        const recolecciones = response.data.recolecciones || 0;
        const telf = response.data.telf || '';
        const direccion = response.data.direccion || '';
        const sector = response.data.sector || '';

        setAuthData({
          token: token,
          rol: rol,
          nombre: nombre,
          email: email,
          puntos: puntos,
          recolecciones: recolecciones,
          telf: telf,
          direccion: direccion,
          sector: sector,
          isLoading: false,
        });

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(ROL_KEY, rol);
        await AsyncStorage.setItem(NOMBRE_KEY, nombre);
        await AsyncStorage.setItem(EMAIL_KEY, email);
        await AsyncStorage.setItem(PUNTOS_KEY, puntos.toString());
        await AsyncStorage.setItem(RECOLECCIONES_KEY, recolecciones.toString());
        await AsyncStorage.setItem(TELF_KEY, telf);
        await AsyncStorage.setItem(DIRECCION_KEY, direccion);
        await AsyncStorage.setItem(SECTOR_KEY, sector);

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      console.error('Error en signIn (AuthContext):', error);
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
        RECOLECCIONES_KEY,
        TELF_KEY,
        DIRECCION_KEY,
        SECTOR_KEY,
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
      recolecciones: 0,
      telf: null,
      direccion: null,
      sector: null,
      isLoading: false,
    });
  };
  const syncStatsWithBackend = async (puntosExtra: number, recoleccionesExtra: number) => {
      if (!authData.token) return;
      
      try {
          await axios.post(`${API_URL}/update-stats/`, {
              puntos_extra: puntosExtra,
              recolecciones_extra: recoleccionesExtra
          }, {
              headers: { Authorization: `Bearer ${authData.token}` }
          });
          console.log("Estadísticas sincronizadas con backend");
      } catch (error) {
          console.error("Error sincronizando estadísticas:", error);
      }
  };

  const addFakePoints = async (amount: number) => {
    if (!authData) return;
    const newPoints = (authData.puntos || 0) + amount;

    setAuthData(prevData => ({
      ...prevData,
      puntos: newPoints,
    }));
    await AsyncStorage.setItem(PUNTOS_KEY, newPoints.toString());

    syncStatsWithBackend(amount, 0);
  };

  const incrementRecolecciones = async () => {
    if (!authData) return;
    const newRecolecciones = (authData.recolecciones || 0) + 1;

    setAuthData(prevData => ({
      ...prevData,
      recolecciones: newRecolecciones,
    }));
    await AsyncStorage.setItem(RECOLECCIONES_KEY, newRecolecciones.toString());
    syncStatsWithBackend(0, 1);
  };

  return (
    <AuthContext.Provider value={{ authData, signIn, signOut, addFakePoints, incrementRecolecciones }}>
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