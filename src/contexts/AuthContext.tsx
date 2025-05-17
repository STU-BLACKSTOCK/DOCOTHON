import React, { createContext, useState, useContext, useEffect } from "react";

type UserRole = "doctor" | "staff" | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (id: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("healthcareUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (id: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Valid users for testing - in a real app, this would be validated against a backend API
      const validUsers = {
        doctors: [
          { id: "ABHA123", password: "doctor123", name: "Dr. Smith" },
          { id: "ABHA456", password: "doctor456", name: "Dr. Johnson" }
        ],
        staff: [
          { id: "STAFF123", password: "staff123", name: "Staff Member 1" },
          { id: "STAFF456", password: "staff456", name: "Staff Member 2" }
        ]
      };

      // Validate credentials based on role
      const users = role === "doctor" ? validUsers.doctors : validUsers.staff;
      const validUser = users.find(user => user.id === id && user.password === password);

      if (validUser) {
        const authenticatedUser = {
          id: validUser.id,
          name: validUser.name,
          role,
        };
        
        localStorage.setItem("healthcareUser", JSON.stringify(authenticatedUser));
        localStorage.setItem("token", "mock-jwt-token"); // Mock token for API calls
        setUser(authenticatedUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("healthcareUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
