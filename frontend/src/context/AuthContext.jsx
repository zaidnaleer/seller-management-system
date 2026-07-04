import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage so a page refresh doesn't log the user out
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));
  const [email, setEmail] = useState(() => localStorage.getItem('user_email'));
  const [role, setRole] = useState(() => localStorage.getItem('user_role'));

  const login = (authResponse) => {
    // authResponse is { token, email, role } — exactly what /auth/login returns
    localStorage.setItem('jwt_token', authResponse.token);
    localStorage.setItem('user_email', authResponse.email);
    localStorage.setItem('user_role', authResponse.role);
    setToken(authResponse.token);
    setEmail(authResponse.email);
    setRole(authResponse.role);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setToken(null);
    setEmail(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components just call useAuth() instead of importing
// useContext + AuthContext everywhere
export function useAuth() {
  return useContext(AuthContext);
}