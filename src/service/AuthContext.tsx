import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from '../../src/config/axios';



interface AuthContextType {
  avatar: string;
  role: string; 
  userId: number | null;
  name: string;
  email: string;
  createdDate: string | null; 
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
  const [name, setName] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 
  const [createdDate, setCreatedDate] = useState<string | null>(null);


  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAvatar(response.data.avatar);
      setRole(response.data.listRoles[0].roleName);
      setUserId(response.data.id);
      setName(response.data.fullName); 
      setEmail(response.data.email);
      setCreatedDate(response.data.createdDate)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      await fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);


  return (
    <AuthContext.Provider
      value={{ avatar, role, userId, name, email, createdDate, isLoggedIn, setIsLoggedIn, checkLoginStatus}}
    >
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
