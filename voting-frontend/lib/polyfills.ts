// Browser polyfills for better compatibility
if (typeof window !== 'undefined') {
  // Add any necessary polyfills here
  
  // Ensure clipboard API is available
  if (!navigator.clipboard) {
    console.warn('Clipboard API not available');
  }
}

export {};
