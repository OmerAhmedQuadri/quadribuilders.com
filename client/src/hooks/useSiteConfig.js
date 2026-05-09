import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';
import { fallbackConfig } from '../config/site.js';

export const useSiteConfig = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: () => api.get('/config').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });
  return { config: data || fallbackConfig, isLoading, error };
};
