import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
const useAuth = () => useContext(AuthContext);

// Componente proveedor de autenticación
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // console.log(import.meta.env.VITE_SOME_KEY)
    // console.log(import.meta.env.VITE_PASSWORD)
    if (username === import.meta.env.VITE_SOME_KEY && password === import.meta.env.VITE_PASSWORD) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportaciones
export { AuthProvider, useAuth };
export default AuthProvider;


