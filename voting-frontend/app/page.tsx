'use client';

import ProposalList from '@/components/ProposalList';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function Home() {
  const { stxAddress, connectWallet } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-block mb-6 animate-bounce">
          <div className="text-7xl">🗳️</div>
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
          Decentralized Voting
          <span className="block text-5xl md:text-6xl bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mt-2">
            Powered by Stacks
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
          Create proposals and vote on important decisions using secure blockchain technology
        </p>

        {!stxAddress && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-lg mx-auto shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
            <div className="text-5xl mb-6 text-center">🔐</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-8 text-center text-lg leading-relaxed">
              Please connect your Stacks wallet to create and vote on proposals
            </p>
            <button
              onClick={connectWallet}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:scale-105 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-lg shadow-2xl shadow-purple-500/50 hover:shadow-3xl hover:shadow-purple-500/60 active:scale-95"
            >
              🚀 Connect Wallet
            </button>
          </div>
        )}

        {stxAddress && (
          <Link
            href="/create"
            className="inline-block bg-white hover:bg-white/90 text-purple-600 px-10 py-4 rounded-2xl transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 border-2 border-white/50"
          >
            ✨ Create New Proposal
          </Link>
        )}
      </div>

      <ProposalList />
    </div>
  );
}
