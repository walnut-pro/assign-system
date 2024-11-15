'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function StaffHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">スタッフ管理</h1>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        新規登録
      </Button>
    </div>
  );
}