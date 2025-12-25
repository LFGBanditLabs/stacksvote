import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
  uintCV,
  boolCV,
  cvToJSON,
  fetchCallReadOnlyFunction,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK } from './constants';

const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  yesVotes: number;
  noVotes: number;
  startBlock: number;
  endBlock: number;
  executed: boolean;
}

export const createProposal = async (
  title: string,
  description: string,
  duration: number
) => {
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-proposal',
      functionArgs: [
        stringUtf8CV(title),
        stringUtf8CV(description),
        uintCV(duration),
      ],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        resolve(data);
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      },
    });
  });
};

export const castVote = async (proposalId: number, voteChoice: boolean) => {
  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'cast-vote',
      functionArgs: [uintCV(proposalId), boolCV(voteChoice)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        resolve(data);
      },
      onCancel: () => {
        reject(new Error('Vote cancelled'));
      },
    });
  });
};

export const getProposalCount = async (): Promise<number> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-proposal-count',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    return parseInt(jsonResult.value.value);
  } catch (error) {
    console.error('Error fetching proposal count:', error);
    return 0;
  }
};

export const getProposal = async (proposalId: number): Promise<Proposal | null> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-proposal',
      functionArgs: [uintCV(proposalId)],
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    
    // Check if result is valid - it's wrapped in response -> optional -> tuple
    if (!jsonResult || !jsonResult.value || !jsonResult.value.value || !jsonResult.value.value.value) {
      console.log(`Proposal ${proposalId} not found`);
      return null;
    }
    
    // Get the actual proposal data from the nested structure
    const proposalData = jsonResult.value.value.value;
    
    try {
      return {
        id: proposalId,
        title: proposalData.title.value,
        description: proposalData.description.value,
        proposer: proposalData.proposer.value,
        yesVotes: parseInt(proposalData['yes-votes'].value),
        noVotes: parseInt(proposalData['no-votes'].value),
        startBlock: parseInt(proposalData['start-block'].value),
        endBlock: parseInt(proposalData['end-block'].value),
        executed: proposalData.executed.value,
      };
    } catch (err) {
      console.error(`Error parsing proposal ${proposalId}:`, err);
      console.log('Proposal data:', proposalData);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching proposal ${proposalId}:`, error);
    return null;
  }
};

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function with retry logic for rate limiting
const fetchWithRetry = async <T>(
  fetchFn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T | null> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchFn();
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
        console.log(`Rate limited, retrying in ${delayMs}ms... (attempt ${i + 1}/${retries})`);
        await delay(delayMs * (i + 1)); // Exponential backoff
        continue;
      }
      throw error; // Re-throw non-rate-limit errors
    }
  }
  return null;
};

// Get paginated proposals - fetch only specific page
export const getPaginatedProposals = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{ proposals: Proposal[]; totalCount: number; hasMore: boolean }> => {
  try {
    const totalCount = await getProposalCount();
    console.log(`Total proposals: ${totalCount}, fetching page ${page}...`);
    
    if (totalCount === 0) {
      console.log('No proposals found in contract');
      return { proposals: [], totalCount: 0, hasMore: false };
    }
    
    // Calculate range (newest first, so we reverse the calculation)
    const startIndex = Math.max(totalCount - (page * pageSize) + 1, 1);
    const endIndex = Math.min(totalCount - ((page - 1) * pageSize), totalCount);
    
    console.log(`Fetching proposals ${startIndex} to ${endIndex}`);
    
    const proposals: Proposal[] = [];

    // Fetch proposals in descending order (newest first)
    for (let i = endIndex; i >= startIndex; i--) {
      const proposal = await fetchWithRetry(() => getProposal(i));
      if (proposal) {
        proposals.push(proposal);
      }
      
      // Add delay between requests to avoid rate limiting
      if (i > startIndex) {
        await delay(300); // 300ms delay between requests
      }
    }

    const hasMore = startIndex > 1;
    return { proposals, totalCount, hasMore };
  } catch (error) {
    console.error('Error fetching paginated proposals:', error);
    return { proposals: [], totalCount: 0, hasMore: false };
  }
};

// Keep the old function for backward compatibility
export const getAllProposals = async (): Promise<Proposal[]> => {
  const { proposals } = await getPaginatedProposals(1, 1000);
  return proposals;
};

export const isProposalActive = async (proposalId: number): Promise<boolean> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'is-proposal-active',
      functionArgs: [uintCV(proposalId)],
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    return jsonResult.value.value;
  } catch (error) {
    console.error('Error checking proposal status:', error);
    return false;
  }
};
