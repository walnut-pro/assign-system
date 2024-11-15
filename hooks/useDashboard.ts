'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface DashboardData {
  locationCount: number;
  activeStaffCount: number;
  pendingShiftCount: number;
  unconfirmedAlertCount: number;
  todayLocations: {
    name: string;
    required_staff: number;
    confirmed_staff: number;
    wakeup_reports: number;
  }[];
}

export function useDashboard() {
  const { data, error, mutate } = useSWR<DashboardData>('/api/dashboard', fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}