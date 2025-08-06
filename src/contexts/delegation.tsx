import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DelegationContextType {
  delegatedOrgId: number | null;
  setDelegatedOrgId: (orgId: number | null) => void;
  isDelegationMode: boolean;
}

const DelegationContext = createContext<DelegationContextType | undefined>(undefined);

export const useDelegation = () => {
  const context = useContext(DelegationContext);
  if (context === undefined) {
    throw new Error('useDelegation must be used within a DelegationProvider');
  }
  return context;
};

interface DelegationProviderProps {
  children: ReactNode;
}

export const DelegationProvider: React.FC<DelegationProviderProps> = ({ children }) => {
  const [delegatedOrgId, setDelegatedOrgId] = useState<number | null>(null);

  const value = {
    delegatedOrgId,
    setDelegatedOrgId,
    isDelegationMode: delegatedOrgId !== null,
  };

  return (
    <DelegationContext.Provider value={value}>
      {children}
    </DelegationContext.Provider>
  );
};