import { useState } from 'react';
import api from '../lib/api.js';

export const useLeadSubmit = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  const submit = async (data) => {
    setStatus('loading');
    setError(null);
    try {
      await api.post('/leads', data);
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => { setStatus('idle'); setError(null); };

  return { submit, status, error, reset };
};
