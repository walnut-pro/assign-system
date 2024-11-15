'use client';

import { Button } from '@/components/ui/button';
import { Upload, Plus, Printer, Wand2, Send } from 'lucide-react';
import { useShifts } from '../hooks/useShifts';
import { useAutoAssign } from '../hooks/useAutoAssign';
import { useLineNotification } from '../hooks/useLineNotification';

export function ShiftPageHeader() {
  const { importShifts } = useShifts();
  const { handleAutoAssign, isLoading: isAutoAssignLoading } = useAutoAssign();
  const { sendLineNotifications, isLoading: isNotificationLoading } = useLineNotification();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">シフト管理</h1>
      <div className="flex gap-3">
        <Button 
          onClick={sendLineNotifications}
          disabled={isNotificationLoading}
          variant="secondary"
        >
          <Send className="mr-2 h-4 w-4" />
          LINE一斉送信
        </Button>
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          印刷
        </Button>
        <Button onClick={handleAutoAssign} disabled={isAutoAssignLoading}>
          <Wand2 className="mr-2 h-4 w-4" />
          自動振り分け
        </Button>
        <Button onClick={() => importShifts([])}>
          <Upload className="mr-2 h-4 w-4" />
          シフトデータ取込
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>
    </div>
  );
}