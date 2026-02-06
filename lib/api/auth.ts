import apiClient from './client';

export interface LoginRequest {
  dni: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const ALLOWED_ROLES = ['ADMIN', 'CALL_CENTER'];

class AuthApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/login', {
        dni: credentials.dni,
        password: credentials.password
      });
      const data = response.data;
      
      // Validar que el usuario tenga un rol permitido
      if (!ALLOWED_ROLES.includes(data.user.role)) {
        throw new Error('No tiene permisos para acceder al sistema');
      }

      return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      }
      throw error;
    }
  }
}

export const authApi = new AuthApiService();