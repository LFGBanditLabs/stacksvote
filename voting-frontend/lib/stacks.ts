import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
  uintCV,
  boolCV,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
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
    
    if (jsonResult.value && jsonResult.value.value) {
      const proposalData = jsonResult.value.value;
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
    }
    return null;
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
};

export const getAllProposals = async (): Promise<Proposal[]> => {
  const count = await getProposalCount();
  const proposals: Proposal[] = [];

  for (let i = 1; i <= count; i++) {
    const proposal = await getProposal(i);
    if (proposal) {
      proposals.push(proposal);
    }
  }

  return proposals.reverse(); // Show newest first
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
