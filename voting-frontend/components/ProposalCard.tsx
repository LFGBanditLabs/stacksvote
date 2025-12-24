'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Proposal, castVote } from '@/lib/stacks';
import { useAuth } from '@/contexts/AuthContext';
import { saveVoteToHistory, getUserVoteOnProposal } from '@/lib/voteHistory';
import ProposalCountdown from './ProposalCountdown';

interface ProposalCardProps {
  proposal: Proposal;
  onVoteSuccess: () => void;
}

export default function ProposalCard({ proposal, onVoteSuccess }: ProposalCardProps) {
  const { userData } = useAuth();
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState('');
  const [userVote, setUserVote] = useState<boolean | null>(null);

  useEffect(() => {
    setUserVote(getUserVoteOnProposal(proposal.id));
  }, [proposal.id]);

  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0;

  const handleVote = async (voteChoice: boolean) => {
    if (!userData) {
      setMessage('Please connect your wallet first');
      return;
    }

    setVoting(true);
    setMessage('');

    try {
      await castVote(proposal.id, voteChoice);
      saveVoteToHistory(proposal.id, voteChoice, proposal.title);
      setUserVote(voteChoice);
      setMessage('Vote cast successfully!');
      setTimeout(() => {
        onVoteSuccess();
      }, 2000);
    } catch (error: any) {
      setMessage('Error casting vote: ' + error.message);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group hover:-translate-y-1">
      <div className="flex items-start justify-between mb-5">
        <Link href={`/proposal/${proposal.id}`}>
          <h3 className="text-2xl font-bold text-gray-900 flex-1 group-hover:text-purple-600 transition-colors cursor-pointer hover:underline">
            {proposal.title}
          </h3>
        </Link>
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
            proposal.executed
              ? 'bg-gray-100 text-gray-600 border border-gray-300'
              : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30'
          }`}
        >
          {proposal.executed ? '✓ Executed' : '● Active'}
        </span>
      </div>

      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{proposal.description}</p>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-6 space-y-3 text-sm border border-purple-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-semibold flex items-center gap-2">
            <span className="text-purple-500">👤</span> Proposer:
          </span>
          <span className="font-mono text-purple-700 font-bold bg-white px-3 py-1 rounded-lg">
            {proposal.proposer.slice(0, 8)}...{proposal.proposer.slice(-6)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-semibold flex items-center gap-2">
            <span className="text-pink-500">⏱️</span> Status:
          </span>
          <ProposalCountdown startBlock={proposal.startBlock} endBlock={proposal.endBlock} />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <span className="text-xl">👍</span> Yes: {proposal.yesVotes}
            </span>
            <span className="font-bold text-green-600 text-lg">{yesPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <span className="text-xl">👎</span> No: {proposal.noVotes}
            </span>
            <span className="font-bold text-red-600 text-lg">{noPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => {
            const url = `${window.location.origin}/proposal/${proposal.id}`;
            navigator.clipboard.writeText(url);
            setMessage('Link copied to clipboard!');
            setTimeout(() => setMessage(''), 2000);
          }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all"
          title="Share proposal"
        >
          🔗 Share
        </button>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => handleVote(true)}
          disabled={voting || proposal.executed || !userData}
          className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-6 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95 ${
            userVote === true ? 'ring-4 ring-green-300' : ''
          }`}
        >
          {voting ? '⏳ Voting...' : userVote === true ? '✓ Voted Yes' : '👍 Vote Yes'}
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={voting || proposal.executed || !userData}
          className={`flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-6 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95 ${
            userVote === false ? 'ring-4 ring-red-300' : ''
          }`}
        >
          {voting ? '⏳ Voting...' : userVote === false ? '✓ Voted No' : '👎 Vote No'}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('Error')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
