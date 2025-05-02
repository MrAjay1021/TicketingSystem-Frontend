import { useState, useEffect } from 'react';
import apiService from '../services/api.jsx';

// Data fetching hook with error and loading states
const useApiData = (dataType, options = {}) => {
  const { initialData = null, dependencies = [] } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pick the right API method based on data type
  const getApiMethod = () => {
    switch (dataType) {
      case 'hero':
        return apiService.getHeroData;
      case 'partners':
        return apiService.getPartnersData;
      case 'features':
        return apiService.getFeaturesData;
      case 'pricing':
        return apiService.getPricingData;
      case 'testimonials':
        return apiService.getTestimonialsData;
      default:
        return () => apiService.getContent(dataType);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiMethod = getApiMethod();
      const result = await apiMethod();
      setData(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${dataType} data:`, err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

export default useApiData; 