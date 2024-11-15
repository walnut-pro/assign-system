'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useShiftConfirmation() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const confirmShift = async (shiftId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/shifts/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId }),
      });

      if (!response.ok) throw new Error('Failed to confirm shift');

      toast.success('シフトを確定しました');
      router.refresh();
    } catch (error) {
      console.error('Error confirming shift:', error);
      toast.error('シフトの確定に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelConfirmation = async (shiftId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/shifts/cancel-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId }),
      });

      if (!response.ok) throw new Error('Failed to cancel confirmation');

      toast.success('シフトの確定をキャンセルしました');
      router.refresh();
    } catch (error) {
      console.error('Error canceling confirmation:', error);
      toast.error('シフトの確定キャンセルに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    confirmShift,
    cancelConfirmation,
    isLoading,
  };
}