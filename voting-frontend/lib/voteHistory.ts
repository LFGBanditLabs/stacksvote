// Vote history management
export interface VoteRecord {
  proposalId: number;
  vote: boolean;
  timestamp: number;
  proposalTitle: string;
}

const VOTE_HISTORY_KEY = 'voting-history';

export const saveVoteToHistory = (
  proposalId: number,
  vote: boolean,
  proposalTitle: string
): void => {
  if (typeof window === 'undefined') return;

  const history = getVoteHistory();
  history.push({
    proposalId,
    vote,
    timestamp: Date.now(),
    proposalTitle,
  });

  localStorage.setItem(VOTE_HISTORY_KEY, JSON.stringify(history));
};

export const getVoteHistory = (): VoteRecord[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(VOTE_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const hasVotedOnProposal = (proposalId: number): boolean => {
  const history = getVoteHistory();
  return history.some((record) => record.proposalId === proposalId);
};

export const getUserVoteOnProposal = (proposalId: number): boolean | null => {
  const history = getVoteHistory();
  const record = history.find((r) => r.proposalId === proposalId);
  return record ? record.vote : null;
};

export const clearVoteHistory = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(VOTE_HISTORY_KEY);
};
