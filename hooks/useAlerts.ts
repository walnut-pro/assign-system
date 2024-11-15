'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Alert {
  shift_id: number;
  staff_id: number;
  staff_name: string;
  location_name: string;
  date: string;
  status: '未連絡' | '報告済み';
  reported_at?: string;
}

export function useAlerts() {
  const { data, error, mutate } = useSWR<{ alerts: Alert[] }>('/api/shifts/alerts', fetcher);
  const [loading, setLoading] = useState(false);

  const confirmAlert = async (shiftId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shifts/alerts/${shiftId}/confirm`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to confirm alert');
      
      mutate();
      return true;
    } catch (error) {
      console.error('Error confirming alert:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    alerts: data?.alerts || [],
    isLoading: !error && !data,
    isError: error,
    confirmAlert,
    loading,
  };
}