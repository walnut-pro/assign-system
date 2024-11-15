'use client';

import { cn } from '@/lib/utils';
import {
  Calendar,
  Users,
  Building2,
  Bell,
  Settings,
  MessageSquare,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'シフト管理', href: '/admin/shifts', icon: Calendar },
  { name: 'スタッフ管理', href: '/admin/staff', icon: Users },
  { name: '現場管理', href: '/admin/locations', icon: Building2 },
  { name: 'アラート', href: '/admin/alerts', icon: Bell },
  { name: '設定', href: '/admin/settings', icon: Settings },
  { name: 'LINE画面（デモ）', href: '/admin/line-demo', icon: MessageSquare },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden',
          open ? 'block' : 'hidden'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r p-4 transition-transform duration-200 ease-in-out md:translate-x-0 md:static',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="font-semibold">メニュー</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}