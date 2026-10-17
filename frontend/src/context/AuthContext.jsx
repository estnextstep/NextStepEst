import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [resetData, setResetData] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);
  
  const login = (data) => {
    const authData = {
      id: data.id,
      role: data.role,
      token: data.token,
      experation: data.experation,
      username: data.username,
    };

    localStorage.setItem("auth", JSON.stringify(authData));
    setUser(authData);
  };

  const logout = async () => {       
    try {
      await api.post("/auth/logout"); 
    } catch (err) {
      console.error("Backend logout failed", err);
    }
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout , resetData, setResetData}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
