import React, { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  uintCV,
  boolCV,
} from '@stacks/transactions';
import './ProposalCard.css';

function ProposalCard({
  proposal,
  userData,
  network,
  contractAddress,
  contractName,
  onVoteSuccess,
}) {
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState('');

  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0;

  const handleVote = async (voteChoice) => {
    setVoting(true);
    setMessage('');

    try {
      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'cast-vote',
        functionArgs: [uintCV(proposal.id), boolCV(voteChoice)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('Vote transaction:', data);
          setMessage('Vote cast successfully! Transaction ID: ' + data.txId);
          setVoting(false);
          setTimeout(() => {
            onVoteSuccess();
          }, 2000);
        },
        onCancel: () => {
          setMessage('Vote cancelled');
          setVoting(false);
        },
      });
    } catch (error) {
      console.error('Error voting:', error);
      setMessage('Error casting vote: ' + error.message);
      setVoting(false);
    }
  };

  return (
    <div className="proposal-card card">
      <div className="proposal-header">
        <h3 className="proposal-title">{proposal.title}</h3>
        <span className={`status-badge ${proposal.executed ? 'executed' : 'active'}`}>
          {proposal.executed ? 'Executed' : 'Active'}
        </span>
      </div>

      <p className="proposal-description">{proposal.description}</p>

      <div className="proposal-meta">
        <div className="meta-item">
          <span className="meta-label">Proposer:</span>
          <span className="meta-value">
            {proposal.proposer.slice(0, 8)}...{proposal.proposer.slice(-6)}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Block Range:</span>
          <span className="meta-value">
            {proposal.startBlock} - {proposal.endBlock}
          </span>
        </div>
      </div>

      <div className="vote-results">
        <div className="vote-bar-container">
          <div className="vote-bar-label">
            <span>👍 Yes: {proposal.yesVotes}</span>
            <span>{yesPercentage.toFixed(1)}%</span>
          </div>
          <div className="vote-bar">
            <div
              className="vote-bar-fill yes"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>

        <div className="vote-bar-container">
          <div className="vote-bar-label">
            <span>👎 No: {proposal.noVotes}</span>
            <span>{noPercentage.toFixed(1)}%</span>
          </div>
          <div className="vote-bar">
            <div
              className="vote-bar-fill no"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="vote-actions">
        <button
          className="success-button"
          onClick={() => handleVote(true)}
          disabled={voting || proposal.executed}
        >
          {voting ? 'Voting...' : 'Vote Yes'}
        </button>
        <button
          className="danger-button"
          onClick={() => handleVote(false)}
          disabled={voting || proposal.executed}
        >
          {voting ? 'Voting...' : 'Vote No'}
        </button>
      </div>

      {message && (
        <div className={`vote-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default ProposalCard;
