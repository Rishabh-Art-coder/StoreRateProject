import { createContext, useContext, useState } from "react";

const SESSION_KEY = "storerate_session";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function readUser() {
  const saved = localStorage.getItem(SESSION_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const login = (userInfo) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userInfo));
    setUser(userInfo);
  };
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}