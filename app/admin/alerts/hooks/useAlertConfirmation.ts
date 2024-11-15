'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAlertConfirmation() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const confirmAlert = async (shiftId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shifts/alerts/${shiftId}/confirm`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to confirm alert');
      }

      toast.success('アラートを確認しました');
      router.refresh();
    } catch (error) {
      console.error('Error confirming alert:', error);
      toast.error('アラートの確認に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmAlert,
    loading,
  };
}