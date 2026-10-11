import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { AuthResponse, User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  quickLoginAs: (role: Role) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bbps_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bbps_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { username, password });
    const authData = res.data;
    localStorage.setItem('bbps_token', authData.token);

    const userObj: User = {
      id: authData.id,
      employeeId: authData.employeeId,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
      status: authData.status,
      department: authData.department,
      designation: authData.designation,
      supervisorEmployeeId: authData.supervisorEmployeeId,
      paidLeaveBalance: authData.paidLeaveBalance,
    };

    localStorage.setItem('bbps_user', JSON.stringify(userObj));
    setToken(authData.token);
    setUser(userObj);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem('bbps_token');
    localStorage.removeItem('bbps_user');
    setToken(null);
    setUser(null);
  };

  const quickLoginAs = async (role: Role) => {
    let email = 'principal@bbps.edu';
    if (role === 'ROLE_SUPERVISOR') email = 'supervisor1@bbps.edu';
    if (role === 'ROLE_STAFF') email = 'staff1@bbps.edu';

    await login(email, 'admin123');
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get<AuthResponse>('/auth/me');
      const authData = res.data;
      const userObj: User = {
        id: authData.id,
        employeeId: authData.employeeId,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
        status: authData.status,
        department: authData.department,
        designation: authData.designation,
        supervisorEmployeeId: authData.supervisorEmployeeId,
        paidLeaveBalance: authData.paidLeaveBalance,
      };
      localStorage.setItem('bbps_user', JSON.stringify(userObj));
      setUser(userObj);
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        quickLoginAs,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
