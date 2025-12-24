'use client';

import { useState, useEffect } from 'react';
import { getAllProposals, Proposal } from '@/lib/stacks';

export default function StatsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProposals();
        setProposals(data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8">📊 Statistics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-xl animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalProposals = proposals.length;
  const activeProposals = proposals.filter((p) => !p.executed).length;
  const executedProposals = proposals.filter((p) => p.executed).length;
  const totalVotes = proposals.reduce((sum, p) => sum + p.yesVotes + p.noVotes, 0);
  const avgVotesPerProposal = totalProposals > 0 ? (totalVotes / totalProposals).toFixed(1) : 0;
  
  const topProposal = proposals.reduce((top, p) => {
    const votes = p.yesVotes + p.noVotes;
    const topVotes = top.yesVotes + top.noVotes;
    return votes > topVotes ? p : top;
  }, proposals[0]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold text-white mb-8 flex items-center gap-4">
        <span>📊</span> Statistics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 shadow-2xl text-white">
          <div className="text-5xl mb-4">🗳️</div>
          <h3 className="text-lg font-semibold mb-2 opacity-90">Total Proposals</h3>
          <p className="text-5xl font-bold">{totalProposals}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 shadow-2xl text-white">
          <div className="text-5xl mb-4">●</div>
          <h3 className="text-lg font-semibold mb-2 opacity-90">Active Proposals</h3>
          <p className="text-5xl font-bold">{activeProposals}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-8 shadow-2xl text-white">
          <div className="text-5xl mb-4">✓</div>
          <h3 className="text-lg font-semibold mb-2 opacity-90">Executed</h3>
          <p className="text-5xl font-bold">{executedProposals}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 shadow-2xl text-white">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-lg font-semibold mb-2 opacity-90">Total Votes Cast</h3>
          <p className="text-5xl font-bold">{totalVotes}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 shadow-2xl text-white">
          <div className="text-5xl mb-4">📈</div>
          <h3 className="text-lg font-semibold mb-2 opacity-90">Avg Votes/Proposal</h3>
          <p className="text-5xl font-bold">{avgVotesPerProposal}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl p-8 shadow-2xl text-white">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold mb-2 opacity-90">Participation</h3>
          <p className="text-5xl font-bold">{totalVotes > 0 ? '🔥' : '💤'}</p>
        </div>
      </div>

      {topProposal && (
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span>🏆</span> Most Voted Proposal
          </h2>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-purple-600">{topProposal.title}</h3>
            <p className="text-gray-700">{topProposal.description}</p>
            <div className="flex gap-6 text-lg">
              <span className="font-bold text-green-600">
                👍 {topProposal.yesVotes} Yes
              </span>
              <span className="font-bold text-red-600">
                👎 {topProposal.noVotes} No
              </span>
              <span className="font-bold text-gray-600">
                Total: {topProposal.yesVotes + topProposal.noVotes}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
