
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  username: string;
  role: 'student' | 'teacher' | 'parent';
  id: string;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  login: (userInfo: { username: string; role: string; token: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    const savedUserInfo = localStorage.getItem('userInfo');
    
    if (savedToken && savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        setUser(userInfo);
        setToken(savedToken);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        logout();
      }
    }
  }, []);

  const login = (userInfo: { username: string; role: string; token: string }) => {
    const user: UserInfo = {
      username: userInfo.username,
      role: userInfo.role as 'student' | 'teacher' | 'parent',
      id: `user-${Date.now()}`
    };
    
    setUser(user);
    setToken(userInfo.token);
    
    localStorage.setItem('authToken', userInfo.token);
    localStorage.setItem('userInfo', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
