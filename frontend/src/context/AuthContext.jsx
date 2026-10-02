import { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function readUserFromToken() {
  try { return JSON.parse(atob(localStorage.getItem('token').split('.')[1])); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUserFromToken);
  const login = (token, userInfo) => { localStorage.setItem('token', token); setUser(userInfo); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}