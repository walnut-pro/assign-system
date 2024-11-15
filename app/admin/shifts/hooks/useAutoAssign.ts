'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAutoAssign() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAutoAssign = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/shifts/auto-assign', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to auto-assign shifts');
      }

      const data = await response.json();
      toast.success(data.message || 'シフトを自動振り分けしました');
      router.refresh();
    } catch (error) {
      console.error('Error auto-assigning shifts:', error);
      toast.error('シフトの自動振り分けに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAutoAssign,
    isLoading,
  };
}