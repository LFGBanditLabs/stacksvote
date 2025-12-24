// Analytics tracking (placeholder for future implementation)
export const analytics = {
  trackPageView: (page: string) => {
    if (process.env.NODE_ENV === 'production') {
      // Add analytics tracking here (e.g., Google Analytics, Plausible)
      console.log('Page view:', page);
    }
  },

  trackEvent: (category: string, action: string, label?: string) => {
    if (process.env.NODE_ENV === 'production') {
      // Add event tracking here
      console.log('Event:', { category, action, label });
    }
  },

  trackProposalCreated: (proposalId: number) => {
    analytics.trackEvent('Proposal', 'Created', `ID: ${proposalId}`);
  },

  trackVoteCast: (proposalId: number, vote: boolean) => {
    analytics.trackEvent('Vote', 'Cast', `ID: ${proposalId}, Vote: ${vote ? 'Yes' : 'No'}`);
  },

  trackWalletConnected: (address: string) => {
    analytics.trackEvent('Wallet', 'Connected', address.slice(0, 10));
  },
};
