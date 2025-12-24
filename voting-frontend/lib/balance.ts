import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { NETWORK } from './constants';

const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

export const getSTXBalance = async (address: string): Promise<number> => {
  try {
    const apiUrl = NETWORK === 'mainnet' 
      ? 'https://api.mainnet.hiro.so'
      : 'https://api.testnet.hiro.so';
    
    const response = await fetch(`${apiUrl}/v2/accounts/${address}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json();
    const balance = parseInt(data.balance, 16);
    
    // Convert from micro-STX to STX
    return balance / 1000000;
  } catch (error) {
    console.error('Error fetching STX balance:', error);
    return 0;
  }
};
