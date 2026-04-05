import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser  = localStorage.getItem("user");

      if (storedToken && storedUser && storedUser !== "undefined") {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Mock user details to bypass authentication
        const demoUser = { name: "Demo User", email: "demo@example.com", _id: "demo-id", role: "admin" };
        const demoToken = "demo-mock-token-123";
        
        localStorage.setItem("token", demoToken);
        localStorage.setItem("user", JSON.stringify(demoUser));
        
        setToken(demoToken);
        setUser(demoUser);
      }
    } catch (e) {
      // If JSON.parse fails, set mock user as fallback
      const demoUser = { name: "Demo User", email: "demo@example.com", _id: "demo-id", role: "admin" };
      const demoToken = "demo-mock-token-123";
      
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify(demoUser));
      
      setToken(demoToken);
      setUser(demoUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, jwtToken) => {
    if (!userData || !jwtToken) return;
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}