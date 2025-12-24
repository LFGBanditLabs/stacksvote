'use client';

import { useState, useEffect } from 'react';
import { getAllProposals, Proposal } from '@/lib/stacks';
import ProposalCard from '@/components/ProposalCard';
import ProposalSkeleton from '@/components/ProposalSkeleton';

export default function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'executed'>('all');

  const fetchProposals = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllProposals();
      setProposals(data);
    } catch (err: any) {
      // Check if it's a contract not found error
      if (err.message && err.message.includes('NoSuchContract')) {
        setError('Contract not deployed yet. Please deploy the voting contract to mainnet first.');
      } else {
        setError('Error loading proposals: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
            <span className="text-4xl">📋</span>
            Loading Proposals...
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <ProposalSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-orange-100 to-yellow-100 backdrop-blur border-2 border-orange-300 text-orange-800 px-8 py-6 rounded-2xl shadow-xl">
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚠️</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Contract Not Deployed</h3>
            <p className="mb-4">{error}</p>
            <div className="bg-white/50 rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Next steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Fund your wallet address: <code className="bg-orange-200 px-2 py-1 rounded">SP1C5DP9C9N2MB8DMZN18EJNSSA3GYNJE3DGN806V</code></li>
                <li>Run: <code className="bg-orange-200 px-2 py-1 rounded">cd counter && clarinet deployments apply --mainnet</code></li>
                <li>Wait for deployment confirmation</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <p className="text-xl text-gray-600">No proposals yet. Be the first to create one!</p>
      </div>
    );
  }

  // Filter proposals based on search query
  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Further filter by status
  const finalFilteredProposals = filteredProposals.filter((proposal) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return !proposal.executed;
    if (statusFilter === 'executed') return proposal.executed;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
          <span className="text-4xl">📋</span>
          Active Proposals ({proposals.length})
        </h2>
        <button
          onClick={fetchProposals}
          className="bg-white hover:bg-white/90 text-purple-600 px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span className="text-xl">🔄</span> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search proposals by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-white/50 bg-white/95 backdrop-blur-xl shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all text-gray-800 placeholder-gray-500 font-medium"
          />
          <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-white mt-2 ml-2 font-medium">
            Found {filteredProposals.length} proposal{filteredProposals.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-white text-purple-600 shadow-xl scale-105'
              : 'bg-white/70 text-gray-700 hover:bg-white/90 shadow-md'
          }`}
        >
          📋 All ({proposals.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            statusFilter === 'active'
              ? 'bg-white text-green-600 shadow-xl scale-105'
              : 'bg-white/70 text-gray-700 hover:bg-white/90 shadow-md'
          }`}
        >
          ● Active ({proposals.filter((p) => !p.executed).length})
        </button>
        <button
          onClick={() => setStatusFilter('executed')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            statusFilter === 'executed'
              ? 'bg-white text-gray-600 shadow-xl scale-105'
              : 'bg-white/70 text-gray-700 hover:bg-white/90 shadow-md'
          }`}
        >
          ✓ Executed ({proposals.filter((p) => p.executed).length})
        </button>
      </div>

      {finalFilteredProposals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-xl text-gray-600">No proposals match your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {finalFilteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onVoteSuccess={fetchProposals}
            />
          ))}
        </div>
      )}
    </div>
  );
}
