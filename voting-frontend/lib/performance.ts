// Performance monitoring utilities
export const logPerformance = (metric: string, value: number) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Performance: ${metric} = ${value.toFixed(2)}ms`);
  }
};

export const measureTime = async <T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  logPerformance(label, duration);
  return result;
};
