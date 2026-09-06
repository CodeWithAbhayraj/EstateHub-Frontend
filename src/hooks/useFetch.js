import { useCallback, useEffect, useState } from "react";

function useFetch(fetchFunction, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction(...args);

        setData(result);

        return result;
      } catch (err) {
        console.error("useFetch error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}

export default useFetch;