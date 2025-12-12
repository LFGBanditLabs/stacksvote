'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { userData, connectWallet, disconnectWallet } = useAuth();

  return (
    <header className="backdrop-blur-xl bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-purple-500/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
              🗳️
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Stacks Voting
              </h1>
              <p className="text-xs text-gray-500 font-medium">Decentralized Governance</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 font-semibold relative group"
            >
              Proposals
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/create"
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 font-semibold relative group"
            >
              Create Proposal
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {userData ? (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-mono font-bold text-purple-700">
                    {userData.profile.stxAddress.mainnet.slice(0, 6)}...{userData.profile.stxAddress.mainnet.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl transition-all font-semibold border border-gray-200 hover:border-gray-300 hover:shadow-md"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:scale-105 text-white px-8 py-2.5 rounded-xl transition-all duration-300 font-bold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60"
              >
                Connect Wallet
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
