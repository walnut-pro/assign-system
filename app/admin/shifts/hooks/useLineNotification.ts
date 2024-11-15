'use client';

import { useState } from 'react';

export function useLineNotification() {
  const [isLoading, setIsLoading] = useState(false);

  const sendLineNotifications = async () => {
    // LINE一斉送信ボタンを無効化（デモ用）
    return;
  };

  return {
    sendLineNotifications,
    isLoading,
  };
}