import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import axios from '../../node_modules/axios'
import { endpoints } from '@/constants/endpoints';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, username: string, password: string, lastname: string, telefono: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    const mockUser: User = {
      id: '1',
      email,
      username: email.split('@')[0],
      role: email.includes('admin') ? UserRole.ADMIN : 
            email.includes('hiring') ? UserRole.HIRING_GROUP :
            email.includes('company') ? UserRole.COMPANY :
            email.includes('employee') ? UserRole.EMPLOYEE :
            UserRole.CANDIDATE,
      firstName: 'Usuario',
      lastName: 'Demo',
      isActive: true,
      createdAt: new Date()
    };
    
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (email: string, username: string, password: string, lastname: string, telefono: string): Promise<boolean> => {
    // Mock registration - replace with real API call
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const fullURL = endpoints.base + endpoints.registerUser
    const res = await axios.post(fullURL, {
      nombre: username,
      email,
      password,
      apellido: lastname,
      telefono
    })
    
    const newUser: User = {
      id: res.data.id,
      email: res.data.email,
      username: res.data.nombre,
      role: UserRole.CANDIDATE, // Asignar rol por defecto
      isActive: true,
      createdAt: new Date()
    };
    
    setUser(newUser);
    return true;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};