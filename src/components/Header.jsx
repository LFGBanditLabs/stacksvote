import React from 'react';
import './Header.css';

function Header({ userData, onConnect, onDisconnect }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h2>🗳️ Stacks Voting</h2>
        </div>
        <div className="header-actions">
          {userData ? (
            <div className="user-info">
              <span className="user-address">
                {userData.profile.stxAddress.testnet.slice(0, 6)}...
                {userData.profile.stxAddress.testnet.slice(-4)}
              </span>
              <button className="secondary-button" onClick={onDisconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="primary-button" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
