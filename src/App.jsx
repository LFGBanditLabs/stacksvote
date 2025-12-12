import React, { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import Header from './components/Header';
import ProposalForm from './components/ProposalForm';
import ProposalList from './components/ProposalList';
import './App.css';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function App() {
  const [userData, setUserData] = useState(null);
  const [network] = useState(new StacksTestnet());
  const [contractAddress, setContractAddress] = useState('');
  const [contractName] = useState('voting');

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'Stacks Voting DApp',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserData(userData);
      },
      userSession,
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut('/');
    setUserData(null);
  };

  return (
    <div className="App">
      <Header
        userData={userData}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      
      <main className="main-content">
        <h1 className="app-title">Decentralized Voting Platform</h1>
        <p className="app-subtitle">
          Create proposals and vote on important decisions using the Stacks blockchain
        </p>

        {!userData ? (
          <div className="connect-prompt card">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your Stacks wallet to create and vote on proposals</p>
            <button className="primary-button" onClick={handleConnect}>
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="contract-config card">
              <h3>Contract Configuration</h3>
              <input
                type="text"
                placeholder="Enter contract address (e.g., ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
              <p className="helper-text">
                Enter the deployed contract address to interact with the voting contract
              </p>
            </div>

            <ProposalForm
              userData={userData}
              network={network}
              contractAddress={contractAddress}
              contractName={contractName}
            />

            <ProposalList
              userData={userData}
              network={network}
              contractAddress={contractAddress}
              contractName={contractName}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
