const API_URL = 'https://edsondoes.pythonanywhere.com/api';
//Notita, por si alguien revisa esto, esta es la direccion oficial de la aplicación
//es decir, no funciona en el emulador, SOLO descomenta esta linea si vas a probar en un dispositivo real

import axios, { AxiosError } from 'axios';

//const API_URL = 'http://10.0.2.2:8000/api';

type AuthSuccessResponse = {
  access: string;
  refresh: string;
  rol: string;
  email: string;
  nombreCompleto: string;
  telf: string | null;
  direccion: string | null;
  sector: string | null;
  puntos: number | null;
  recolecciones: number | null;
};

type AuthErrorResponse = {
  detail: string;
  email?: string[];
  username?: string[];
  password?: string[];
  first_name?: string[];
  last_name?: string[];
  [key: string]: any;
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<AuthSuccessResponse>(`${API_URL}/token/`, {
      username: email,
      password: password,
    });

    if (response.data.access) {
      console.log('Login Exitoso! Rol:', response.data.rol);
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Respuesta inválida del servidor' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AuthErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.detail ||
        'Error de red o servidor no responde';
      console.error('Error en el login (Axios):', errorMessage);
      return { success: false, error: errorMessage };
    } else {
      console.error('Error en el login (Desconocido):', error);
      return { success: false, error: 'Ocurrió un error inesperado' };
    }
  }
};

export type RegisterData = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
  telf: string;
  direccion: string;
  sector: string;
};

type RegisterSuccessResponse = {
  username: string;
  email: string;
};

export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post<RegisterSuccessResponse>(
      `${API_URL}/register/`,
      data,
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AuthErrorResponse>;
      let errorMessage = 'Error al registrar. Intente de nuevo.';
      
      if (axiosError.response?.data) {
        const errors = axiosError.response.data;
        if (errors.email) {
          errorMessage = `Email: ${errors.email[0]}`;
        } else if (errors.username) {
          errorMessage = `Username: ${errors.username[0]}`;
        } else if (errors.password) {
          errorMessage = `Password: ${errors.password[0]}`;
        } else if (errors.detail) {
          errorMessage = errors.detail;
        } else {
          try {
            const firstKey = Object.keys(errors)[0];
            errorMessage = `${firstKey}: ${errors[firstKey][0]}`;
          } catch (e) {
          }
        }
      }
      console.error('Error en el registro (Axios):', errorMessage);
      return { success: false, error: errorMessage };
    } else {
      console.error('Error en el registro (Desconocido):', error);
      return { success: false, error: 'Ocurrió un error inesperado' };
    }
  }
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