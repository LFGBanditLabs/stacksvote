'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, connect } from '@stacks/connect';

interface UserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
  };
}

interface AuthContextType {
  userData: UserData | null;
  userSession: UserSession;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData: any) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = async () => {
    try {
      const result = await connect({
        appDetails: {
          name: 'Stacks Voting DApp',
          icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '',
        },
        onFinish: () => {
          // Reload user data after connection
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            setUserData(userData);
          }
        },
        userSession,
      });
      
      // Update user data immediately after connection
      if (result && userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        setUserData(userData);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    userSession.signUserOut('/');
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        userSession,
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
