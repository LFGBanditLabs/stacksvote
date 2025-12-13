'use client';

import { useState, useEffect } from 'react';
import { getAllProposals, Proposal } from '@/lib/stacks';
import ProposalCard from '@/components/ProposalCard';

export default function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onVoteSuccess={fetchProposals}
          />
        ))}
      </div>
    </div>
  );
}
