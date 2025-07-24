import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'analyst' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin: Date;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const rolePermissions: Record<UserRole, string[]> = {
  analyst: ['view_dashboard', 'view_transactions', 'export_basic'],
  supervisor: ['view_dashboard', 'view_transactions', 'export_basic', 'export_advanced', 'manage_alerts', 'view_reports'],
  admin: ['*'] // All permissions
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('conan_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Convert lastLogin string back to Date object
        if (parsedUser.lastLogin) {
          parsedUser.lastLogin = new Date(parsedUser.lastLogin);
        }
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('conan_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    const mockUsers: Record<string, { password: string; user: User }> = {
      'analyst@bank.com': {
        password: 'password123',
        user: {
          id: '1',
          name: 'Ahmed Al-Rashid',
          email: 'analyst@bank.com',
          role: 'analyst',
          lastLogin: new Date(),
          permissions: rolePermissions.analyst
        }
      },
      'supervisor@bank.com': {
        password: 'password123',
        user: {
          id: '2',
          name: 'Sara Al-Fahad',
          email: 'supervisor@bank.com',
          role: 'supervisor',
          lastLogin: new Date(),
          permissions: rolePermissions.supervisor
        }
      },
      'admin@bank.com': {
        password: 'password123',
        user: {
          id: '3',
          name: 'Mohammed Al-Saud',
          email: 'admin@bank.com',
          role: 'admin',
          lastLogin: new Date(),
          permissions: rolePermissions.admin
        }
      }
    };

    const userRecord = mockUsers[email];
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      localStorage.setItem('conan_user', JSON.stringify(userRecord.user));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('conan_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasPermission,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};