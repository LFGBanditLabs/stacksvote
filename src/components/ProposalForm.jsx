import React, { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
  uintCV,
} from '@stacks/transactions';
import './ProposalForm.css';

function ProposalForm({ userData, network, contractAddress, contractName }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('144'); // ~1 day in blocks
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contractAddress) {
      setMessage('Please enter a contract address first');
      return;
    }

    if (!title || !description || !duration) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'create-proposal',
        functionArgs: [
          stringUtf8CV(title),
          stringUtf8CV(description),
          uintCV(parseInt(duration)),
        ],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('Transaction:', data);
          setMessage('Proposal created successfully! Transaction ID: ' + data.txId);
          setTitle('');
          setDescription('');
          setDuration('144');
          setLoading(false);
        },
        onCancel: () => {
          setMessage('Transaction cancelled');
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      setMessage('Error creating proposal: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="proposal-form card">
      <h2>Create New Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title (max 100 characters)"
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter proposal description (max 500 characters)"
            maxLength={500}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (in blocks)</label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration in blocks (~10 minutes per block)"
            min="1"
            required
          />
          <p className="helper-text">
            1 block ≈ 10 minutes. Default: 144 blocks ≈ 1 day
          </p>
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !contractAddress}
        >
          {loading ? 'Creating...' : 'Create Proposal'}
        </button>
      </form>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}
    </div>
  );
}

export default ProposalForm;
