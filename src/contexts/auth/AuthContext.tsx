
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './authTypes';
import { useAuthProvider } from './useAuthProvider';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; mockMode?: boolean }> = ({ 
  children,
  mockMode = false
}) => {
  const auth = useAuthProvider(mockMode);

  return (
    <AuthContext.Provider value={auth}>
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
