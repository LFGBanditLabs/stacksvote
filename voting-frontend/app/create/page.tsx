'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createProposal } from '@/lib/stacks';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function CreateProposal() {
  const router = useRouter();
  const { userData, connectWallet } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('144'); // ~1 day
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) {
      setMessage('Please connect your wallet first');
      return;
    }

    if (!title || !description || !duration) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await createProposal(title, description, parseInt(duration));
      setMessage('Proposal created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setMessage('Error creating proposal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            You need to connect your wallet to create proposals
          </p>
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-2xl transition-all duration-300 font-bold text-lg shadow-lg hover:scale-105 active:scale-95"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Proposal
          </h1>
          <p className="text-gray-600">Shape the future with your ideas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter proposal title (max 100 characters)"
              maxLength={100}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
            />
            <p className="text-sm text-gray-500 mt-2">{title.length}/100 characters</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter proposal description (max 500 characters)"
              maxLength={500}
              rows={6}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">{description.length}/500 characters</p>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-bold text-gray-700 mb-2">
              Duration (in blocks)
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration in blocks"
              min="1"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
            />
            <p className="text-sm text-gray-500 mt-2">
              1 block ≈ 10 minutes. Default: 144 blocks ≈ 1 day
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {loading ? '⏳ Creating Proposal...' : '🚀 Create Proposal'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              message.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
