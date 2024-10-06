import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from '../../src/config/axios';

interface AuthContextType {
  avatar: string;
  role: string; 
  userId:number | null;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  checkLoginStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState<string>(''); 
  const [role, setRole] = useState<string>(''); 
  const [userId, setUserId] = useState<number | null>(null);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAvatar(response.data.avatar);
      setRole(response.data.listRoles[0].roleName);
      setUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ avatar, role, userId, isLoggedIn, setIsLoggedIn, checkLoginStatus }}>
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