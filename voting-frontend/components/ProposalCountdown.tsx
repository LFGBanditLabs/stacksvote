'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  endBlock: number;
  startBlock: number;
}

export default function ProposalCountdown({ endBlock, startBlock }: CountdownProps) {
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [status, setStatus] = useState<'pending' | 'active' | 'ended'>('pending');

  useEffect(() => {
    // Fetch current block height
    const fetchBlockHeight = async () => {
      try {
        const response = await fetch('https://api.mainnet.hiro.so/v2/info');
        const data = await response.json();
        const height = data.stacks_tip_height;
        setCurrentBlock(height);

        if (height < startBlock) {
          setStatus('pending');
        } else if (height >= startBlock && height <= endBlock) {
          setStatus('active');
        } else {
          setStatus('ended');
        }
      } catch (error) {
        console.error('Error fetching block height:', error);
      }
    };

    fetchBlockHeight();
    const interval = setInterval(fetchBlockHeight, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [endBlock, startBlock]);

  if (currentBlock === null) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  const blocksRemaining = Math.max(0, endBlock - currentBlock);
  const blocksUntilStart = Math.max(0, startBlock - currentBlock);
  
  // Roughly 10 minutes per block
  const minutesRemaining = blocksRemaining * 10;
  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const daysRemaining = Math.floor(hoursRemaining / 24);

  if (status === 'pending') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
        <span>⏳</span>
        <span>Starts in {blocksUntilStart} blocks</span>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold">
        <span>⏹️</span>
        <span>Voting Ended</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
      <span>⏱️</span>
      <span>
        {daysRemaining > 0 && `${daysRemaining}d `}
        {hoursRemaining % 24}h • {blocksRemaining} blocks left
      </span>
    </div>
  );
}
