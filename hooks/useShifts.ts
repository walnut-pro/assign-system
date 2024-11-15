'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Shift {
  id: number;
  date: string;
  staff_id: number;
  location_id: number;
  status: 'pending' | 'confirmed' | 'completed';
  staff_name: string;
  location_name: string;
  location_address: string;
  created_at: string;
  updated_at: string;
}

export function useShifts() {
  const { data, error, mutate } = useSWR<Shift[]>('/api/shifts', fetcher);
  const [loading, setLoading] = useState(false);

  const importShifts = async (shiftsData: Omit<Shift, 'id'>[]) => {
    try {
      setLoading(true);
      const response = await fetch('/api/shifts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shifts: shiftsData }),
      });
      
      if (!response.ok) throw new Error('Failed to import shifts');
      
      mutate();
      return true;
    } catch (error) {
      console.error('Error importing shifts:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignStaff = async (shiftId: number, staffId: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/shifts/assign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId, staffId }),
      });
      
      if (!response.ok) throw new Error('Failed to assign staff');
      
      mutate();
      return true;
    } catch (error) {
      console.error('Error assigning staff:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const confirmShift = async (shiftId: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/shifts/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId }),
      });
      
      if (!response.ok) throw new Error('Failed to confirm shift');
      
      mutate();
      return true;
    } catch (error) {
      console.error('Error confirming shift:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    shifts: data,
    isLoading: !error && !data,
    isError: error,
    importShifts,
    assignStaff,
    confirmShift,
    loading,
    mutate,
  };
}