'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/Layout/mode-toggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="font-semibold text-lg">スタッフアサイン管理システム</div>
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}