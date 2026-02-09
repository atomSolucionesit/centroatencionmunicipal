import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          token,
          user,
          loading: false,
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      token,
      user,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
    });
    window.location.reload();
  };

  return {
    ...authState,
    login,
    logout,
  };
}
