import React, { useState, useEffect } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import ProposalCard from './ProposalCard';
import './ProposalList.css';

function ProposalList({ userData, network, contractAddress, contractName }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [proposalCount, setProposalCount] = useState(0);

  useEffect(() => {
    if (contractAddress) {
      fetchProposalCount();
    }
  }, [contractAddress]);

  const fetchProposalCount = async () => {
    try {
      const result = await callReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        functionName: 'get-proposal-count',
        functionArgs: [],
        senderAddress: contractAddress,
      });

      const count = cvToJSON(result).value.value;
      setProposalCount(parseInt(count));
      
      if (count > 0) {
        fetchProposals(parseInt(count));
      }
    } catch (error) {
      console.error('Error fetching proposal count:', error);
      setError('Error fetching proposals. Make sure the contract is deployed.');
    }
  };

  const fetchProposals = async (count) => {
    setLoading(true);
    setError('');
    const proposalsData = [];

    try {
      for (let i = 1; i <= count; i++) {
        const proposalResult = await callReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          functionName: 'get-proposal',
          functionArgs: [uintCV(i)],
          senderAddress: contractAddress,
        });

        const proposal = cvToJSON(proposalResult);
        
        if (proposal.value && proposal.value.value) {
          const proposalData = proposal.value.value;
          
          proposalsData.push({
            id: i,
            title: proposalData.title.value,
            description: proposalData.description.value,
            proposer: proposalData.proposer.value,
            yesVotes: parseInt(proposalData['yes-votes'].value),
            noVotes: parseInt(proposalData['no-votes'].value),
            startBlock: parseInt(proposalData['start-block'].value),
            endBlock: parseInt(proposalData['end-block'].value),
            executed: proposalData.executed.value,
          });
        }
      }

      setProposals(proposalsData.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setError('Error loading proposal details');
    } finally {
      setLoading(false);
    }
  };

  const refreshProposals = () => {
    if (contractAddress) {
      fetchProposalCount();
    }
  };

  if (!contractAddress) {
    return (
      <div className="proposal-list card">
        <h2>Proposals</h2>
        <p className="no-proposals">Please enter a contract address to view proposals</p>
      </div>
    );
  }

  return (
    <div className="proposal-list">
      <div className="list-header">
        <h2>Active Proposals ({proposalCount})</h2>
        <button className="secondary-button refresh-button" onClick={refreshProposals}>
          🔄 Refresh
        </button>
      </div>

      {loading && <div className="loading">Loading proposals...</div>}
      
      {error && <div className="error-message">{error}</div>}

      {!loading && proposals.length === 0 && !error && (
        <div className="card no-proposals">
          <p>No proposals yet. Be the first to create one!</p>
        </div>
      )}

      {!loading && proposals.length > 0 && (
        <div className="proposals-grid">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              userData={userData}
              network={network}
              contractAddress={contractAddress}
              contractName={contractName}
              onVoteSuccess={refreshProposals}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProposalList;
