import axios, { AxiosError } from 'axios';

const API_URL = 'https://edsondoes.pythonanywhere.com/api';
type AuthSuccessResponse = {
  access: string;
  refresh: string;
  rol: string;
  email: string;
  nombreCompleto: string;
};

type AuthErrorResponse = {
  detail: string;
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<AuthSuccessResponse>(`${API_URL}/token/`, {
      username: email,
      password: password,
    });

    if (response.data.access) {
      console.log('¡Login Exitoso! Rol:', response.data.rol);
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Respuesta inválida del servidor' };
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AuthErrorResponse>;
      const errorMessage = axiosError.response?.data?.detail || 'Error de red o servidor no responde';
      console.error('Error en el login (Axios):', errorMessage);
      return { success: false, error: errorMessage };
    } else {
      console.error('Error en el login (Desconocido):', error);
      return { success: false, error: 'Ocurrió un error inesperado' };
    }
  }
};