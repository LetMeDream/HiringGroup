import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import axios from '../../node_modules/axios'
import { endpoints } from '@/constants/endpoints';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, username: string, password: string, lastname: string, telefono: string, role: string) => Promise<boolean>;
  empresa: string;
  setEmpresa: (empresa: string) => void;
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
  const [user, setUser] = useState<User | null >(/* {
    id: '30',
    email: '',
    username: '',
    role: UserRole.COMPANY,
    isActive: false,
    createdAt: new Date()
  } */);
  const [empresa, setEmpresa] = useState<string>('');

  const mapBackendRoleToFrontend = (role: string): UserRole => {
    switch (role) {
      case 'ADMIN':
        return UserRole.ADMIN;
      case 'HIRING_GROUP':
        return UserRole.HIRING_GROUP;
      case 'EMPRESA':
        return UserRole.COMPANY;
      case 'POSTULANTE':
        return UserRole.POSTULANTE;
      case 'CONTRATADO':
        return UserRole.EMPLOYEE;
      default:
        return UserRole.POSTULANTE;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real API call
    const loginUrl = endpoints.base + endpoints.login
    const res = await axios.post(loginUrl, {
      email,
      password
    })
    const user = res.data.user

    if (res.status === 200 && user) {
      // Mock user data based on email
      const finalUser: User = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: mapBackendRoleToFrontend(user.role), // ← usa la función de mapeo aquí
        firstName: 'Usuario',
        lastName: 'Demo',
        isActive: true,
        createdAt: new Date()
      };

      if (user?.empresa?.length > 0) {
        setEmpresa(user.empresa)
      }

      setUser(finalUser);
      return true;
    } else {
      return false
    }
    
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (email: string, username: string, password: string, lastname: string, telefono: string, role: string): Promise<boolean> => {
    // Mapear el valor del select a los valores esperados por el backend
    let backendRole = 'POSTULANTE';
    if (role === 'hiring') backendRole = 'HIRING_GROUP';
    else if (role === 'empresa') backendRole = 'EMPRESA';
    else if (role === 'candidato') backendRole = 'POSTULANTE';
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const fullURL = endpoints.base + endpoints.registerUser
    const res = await axios.post(fullURL, {
      nombre: username,
      email,
      password,
      apellido: lastname,
      telefono,
      role: backendRole
    })
    
    const newUser: User = {
      id: res.data.id,
      email: res.data.email,
      username: res.data.nombre,
      role: backendRole === 'HIRING_GROUP' ? UserRole.HIRING_GROUP :
            backendRole === 'EMPRESA' ? UserRole.COMPANY :
            backendRole === 'ADMIN' ? UserRole.ADMIN :
            backendRole === 'CONTRATADO' ? UserRole.EMPLOYEE :
            UserRole.POSTULANTE,
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
    register,
    empresa,
    setEmpresa
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};