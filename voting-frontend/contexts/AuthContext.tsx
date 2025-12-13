'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connect, disconnect, isConnected, getLocalStorage, type StorageData } from '@stacks/connect';

interface AuthContextType {
  userData: StorageData | null;
  stxAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<StorageData | null>(null);
  const [stxAddress, setStxAddress] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider mounted');
    
    // Check if user is already connected
    if (isConnected()) {
      console.log('✅ User is connected');
      const data = getLocalStorage();
      console.log('User data from storage:', data);
      
      if (data?.addresses?.stx?.[0]) {
        setUserData(data);
        setStxAddress(data.addresses.stx[0].address);
        console.log('STX Address:', data.addresses.stx[0].address);
      }
    } else {
      console.log('❌ User not connected');
    }
  }, []);

  const connectWallet = async () => {
    console.log('🔌 Connect wallet clicked');
    
    try {
      if (isConnected()) {
        console.log('⚠️ Already connected');
        return;
      }

      console.log('Calling connect()...');
      const response = await connect();
      
      console.log('✅ Connected! Response:', response);
      console.log('Addresses:', response.addresses);
      
      // Update state with new data
      const data = getLocalStorage();
      if (data?.addresses?.stx?.[0]) {
        setUserData(data as UserData);
        setStxAddress(data.addresses.stx[0].address);
        console.log('✅ STX Address set:', data.addresses.stx[0].address);
      }
      
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    console.log('🔌 Disconnecting wallet...');
    disconnect();
    setUserData(null);
    setStxAddress(null);
    console.log('✅ Wallet disconnected');
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        stxAddress,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
