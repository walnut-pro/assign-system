'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Location {
  id: number;
  name: string;
  address: string;
  required_staff: number;
  difficulty: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'planned';
  created_at: string;
  updated_at: string;
}

export function useLocations() {
  const { data, error, mutate } = useSWR<Location[]>('/api/locations', fetcher);
  const [loading, setLoading] = useState(false);

  const importLocations = async (locationsData: Omit<Location, 'id'>[]) => {
    try {
      setLoading(true);
      const response = await fetch('/api/locations/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: locationsData }),
      });
      
      if (!response.ok) throw new Error('Failed to import locations');
      
      mutate();
      return true;
    } catch (error) {
      console.error('Error importing locations:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    locations: data,
    isLoading: !error && !data,
    isError: error,
    importLocations,
    loading,
    mutate,
  };
}