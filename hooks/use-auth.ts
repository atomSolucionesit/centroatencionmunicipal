import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    // Verificar si hay token guardado
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          token,
          user,
        });
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      token,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}