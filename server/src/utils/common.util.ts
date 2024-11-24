const DEFAULT_MAX_RETRIES = 100;

export const handleRetry = async <T>({
  resultFn,
  shouldRetryFn,
  maxRetries = DEFAULT_MAX_RETRIES,
}: {
  resultFn: () => T | Promise<T>;
  shouldRetryFn: (text: T) => Promise<boolean>; // true: collision, false: no collision
  maxRetries?: number;
}): Promise<T | null> => {
  try {
    let retryCount = 0;
    let result: T | null = null;
    while (true) {
      if (retryCount > maxRetries) return null;
      result = await resultFn();
      const shouldRetry = await shouldRetryFn(result);
      if (!shouldRetry) break;
      retryCount++;
    }
    return result;
  } catch {
    return null;
  }
};
