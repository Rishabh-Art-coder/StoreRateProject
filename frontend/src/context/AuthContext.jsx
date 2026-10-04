import { createContext, useContext, useState } from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../api/client.js";

const SESSION_KEY = "storerate_session";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function readUser() {
  const saved = localStorage.getItem(SESSION_KEY);
  if (!saved || !getAuthToken()) {
    localStorage.removeItem(SESSION_KEY);
    clearAuthToken();
    return null;
  }
  try {
    const user = JSON.parse(saved);
    if (!user || typeof user !== "object") throw new Error("Invalid saved session");
    return user;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    clearAuthToken();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const login = (userInfo, token) => {
    setAuthToken(token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userInfo));
    setUser(userInfo);
  };
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    clearAuthToken();
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}