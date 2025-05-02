import { useState, useEffect } from 'react';

/**
 * Custom hook for API data fetching with loading and error states
 * @param {Function} apiFunction - API function to call
 * @param {Array} deps - Dependencies array for useEffect
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useApi = (apiFunction, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for handling form submissions to the API
 * @param {Function} submitFunction - API function for submission
 * @returns {Object} - { submit, loading, error, success }
 */
export const useSubmit = (submitFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await submitFunction(data);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || 'Submission failed');
      console.error('Submission Error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success };
};

export default { useApi, useSubmit }; 