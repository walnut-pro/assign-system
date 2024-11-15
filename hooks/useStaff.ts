'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Staff {
  id: number;
  name: string;
  phone: string;
  address: string;
  skills: string[];
  status: 'active' | 'inactive' | 'retired';
}

export function useStaff() {
  const { data, error, mutate } = useSWR<Staff[]>('/api/staff', fetcher);
  const [loading, setLoading] = useState(false);

  const createStaff = async (staffData: Omit<Staff, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData),
      });
      
      if (!response.ok) throw new Error('Failed to create staff');
      
      mutate(); // Refresh the staff list
      return true;
    } catch (error) {
      console.error('Error creating staff:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    staff: data,
    isLoading: !error && !data,
    isError: error,
    createStaff,
    loading,
  };
}