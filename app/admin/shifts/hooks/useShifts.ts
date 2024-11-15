'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useShifts() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const importShifts = async (shiftsData: any[]) => {
    try {
      setLoading(true);
      const response = await fetch('/api/shifts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shifts: shiftsData }),
      });
      
      if (!response.ok) throw new Error('Failed to import shifts');
      
      toast.success('シフトデータを取り込みました');
      router.refresh();
    } catch (error) {
      console.error('Error importing shifts:', error);
      toast.error('シフトデータの取り込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    importShifts,
    loading,
  };
}