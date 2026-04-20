import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  avatar: string;
  nombre: string;
  pais: string;
  genero: string;
  biografia: string;
}

interface RegistrationContextType {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  resetData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const initialData: RegistrationData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  avatar: '',
  nombre: '',
  pais: '',
  genero: '',
  biografia: '',
};

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<RegistrationData>(initialData);

  const updateData = (updates: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <RegistrationContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
