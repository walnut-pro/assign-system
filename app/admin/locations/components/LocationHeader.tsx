'use client';

import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

export function LocationHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">現場管理</h1>
      <div className="flex gap-3">
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          現場データ取込
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>
    </div>
  );
}