// Form validation helpers
export const validateProposalTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.length < 5) {
    return 'Title must be at least 5 characters';
  }
  if (title.length > 100) {
    return 'Title must not exceed 100 characters';
  }
  return null;
};

export const validateProposalDescription = (description: string): string | null => {
  if (!description || description.trim().length === 0) {
    return 'Description is required';
  }
  if (description.length < 20) {
    return 'Description must be at least 20 characters';
  }
  if (description.length > 500) {
    return 'Description must not exceed 500 characters';
  }
  return null;
};

export const validateDuration = (duration: string): string | null => {
  const num = parseInt(duration);
  if (isNaN(num)) {
    return 'Duration must be a number';
  }
  if (num < 10) {
    return 'Duration must be at least 10 blocks (~100 minutes)';
  }
  if (num > 52560) {
    return 'Duration must not exceed 52560 blocks (~1 year)';
  }
  return null;
};
