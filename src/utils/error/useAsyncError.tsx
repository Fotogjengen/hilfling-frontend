import { useState, useCallback } from "react";
// this function was a test to get ErrorBoundHandler to handle async
// api calls. But it seems to not work with functional components and hooks
// should work with classes
export const useAsyncError = (e: Error) => {
  const [_, setError] = useState();
  return useCallback(
    e => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};
