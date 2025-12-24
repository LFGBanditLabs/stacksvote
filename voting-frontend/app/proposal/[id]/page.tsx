'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProposal, Proposal, castVote } from '@/lib/stacks';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { saveVoteToHistory, getUserVoteOnProposal } from '@/lib/voteHistory';

export const dynamic = 'force-dynamic';

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { userData } = useAuth();
  const { showToast } = useToast();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);

  const proposalId = parseInt(params.id);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const data = await getProposal(proposalId);
        if (data) {
          setProposal(data);
          setUserVote(getUserVoteOnProposal(proposalId));
        } else {
          showToast('Proposal not found', 'error');
          router.push('/');
        }
      } catch (error: any) {
        showToast('Error loading proposal: ' + error.message, 'error');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId, router, showToast]);

  const handleVote = async (voteChoice: boolean) => {
    if (!userData) {
      showToast('Please connect your wallet first', 'warning');
      return;
    }

    if (!proposal) return;

    setVoting(true);
    try {
      await castVote(proposal.id, voteChoice);
      saveVoteToHistory(proposal.id, voteChoice, proposal.title);
      setUserVote(voteChoice);
      showToast('Vote cast successfully!', 'success');
      
      // Refresh proposal data
      const updatedProposal = await getProposal(proposalId);
      if (updatedProposal) {
        setProposal(updatedProposal);
      }
    } catch (error: any) {
      showToast('Error casting vote: ' + error.message, 'error');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-10 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3 mb-8">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return null;
  }

  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-white hover:text-white/80 flex items-center gap-2 font-semibold text-lg"
      >
        ← Back to Proposals
      </button>

      <div className="bg-white rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900 flex-1">{proposal.title}</h1>
            <span
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                proposal.executed
                  ? 'bg-gray-100 text-gray-600 border border-gray-300'
                  : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
              }`}
            >
              {proposal.executed ? '✓ Executed' : '● Active'}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-purple-500 text-xl">👤</span>
              <span className="font-mono font-bold">
                {proposal.proposer.slice(0, 12)}...{proposal.proposer.slice(-8)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-500 text-xl">🆔</span>
              <span className="font-bold">ID: {proposal.id}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {proposal.description}
          </p>
        </div>

        {/* Block Info */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Voting Period</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold mb-1">Start Block</p>
              <p className="text-2xl font-bold text-purple-600">{proposal.startBlock}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold mb-1">End Block</p>
              <p className="text-2xl font-bold text-pink-600">{proposal.endBlock}</p>
            </div>
          </div>
        </div>

        {/* Voting Results */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Voting Results</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <span className="text-3xl">👍</span> Yes Votes
                </span>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">{proposal.yesVotes}</p>
                  <p className="text-lg font-semibold text-gray-600">{yesPercentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-8 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-500 shadow-lg"
                  style={{ width: `${yesPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <span className="text-3xl">👎</span> No Votes
                </span>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-600">{proposal.noVotes}</p>
                  <p className="text-lg font-semibold text-gray-600">{noPercentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-8 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 transition-all duration-500 shadow-lg"
                  style={{ width: `${noPercentage}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-700">Total Votes</span>
                <span className="text-3xl font-bold text-gray-900">{totalVotes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vote Buttons */}
        {!proposal.executed && (
          <div className="flex gap-4">
            <button
              onClick={() => handleVote(true)}
              disabled={voting || !userData}
              className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-8 rounded-2xl transition-all duration-300 font-bold text-xl shadow-lg hover:shadow-2xl disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
                userVote === true ? 'ring-4 ring-green-300' : ''
              }`}
            >
              {voting ? '⏳ Voting...' : userVote === true ? '✓ Voted Yes' : '👍 Vote Yes'}
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={voting || !userData}
              className={`flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-8 rounded-2xl transition-all duration-300 font-bold text-xl shadow-lg hover:shadow-2xl disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
                userVote === false ? 'ring-4 ring-red-300' : ''
              }`}
            >
              {voting ? '⏳ Voting...' : userVote === false ? '✓ Voted No' : '👎 Vote No'}
            </button>
          </div>
        )}

        {!userData && !proposal.executed && (
          <p className="text-center text-gray-600 mt-4 font-semibold">
            Connect your wallet to vote on this proposal
          </p>
        )}
      </div>
    </div>
  );
}
