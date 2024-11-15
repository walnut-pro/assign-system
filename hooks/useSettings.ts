'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Settings {
  companyName: string;
  timezone: string;
  autoArchive: boolean;
  emailNotifications: boolean;
  lineNotifications: boolean;
  wakeupAlerts: boolean;
}

export function useSettings() {
  const { data, error, mutate } = useSWR<Settings>('/api/settings', fetcher);
  const [loading, setLoading] = useState(false);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) throw new Error('Failed to update settings');
      
      mutate({ ...data, ...newSettings });
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
    updateSettings,
    loading,
  };
}