'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface LineMessage {
  userId: string;
  staffName: string;
  locationName: string;
  date: string;
  address: string;
  timestamp: string;
}

const DEMO_MESSAGES = [
  {
    userId: 'U1234567890abcdef',
    staffName: '山田太郎',
    locationName: '渋谷現場A',
    date: format(new Date(), 'M月d日(E)', { locale: ja }),
    address: '東京都渋谷区...',
    timestamp: format(new Date(), 'HH:mm')
  },
  {
    userId: 'U2345678901abcdef',
    staffName: '佐藤花子',
    locationName: '新宿現場B',
    date: format(new Date(), 'M月d日(E)', { locale: ja }),
    address: '東京都新宿区...',
    timestamp: format(new Date(), 'HH:mm')
  },
  {
    userId: 'U3456789012abcdef',
    staffName: '鈴木一郎',
    locationName: '池袋現場C',
    date: format(new Date(), 'M月d日(E)', { locale: ja }),
    address: '東京都豊島区...',
    timestamp: format(new Date(), 'HH:mm')
  }
];

export default function LineDemo() {
  const [messages, setMessages] = useState<LineMessage[]>([]);

  useEffect(() => {
    // 5秒後にデモメッセージを表示
    const timer = setTimeout(() => {
      setMessages(DEMO_MESSAGES);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">LINE画面（デモ）</h1>
        <Badge variant="outline">デモ環境</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['山田太郎', '佐藤花子', '鈴木一郎'].map((name, index) => (
          <Card key={name} className="h-[600px] flex flex-col">
            <CardHeader className="bg-[#00B900] text-white">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${index}`} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages
                    .filter(msg => msg.staffName === name)
                    .map((message, i) => (
                      <div
                        key={i}
                        className="ml-auto max-w-[85%] bg-[#00B900] text-white p-4 rounded-2xl rounded-tr-sm"
                      >
                        <div className="font-bold mb-2">シフト通知</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{message.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{message.locationName}</span>
                          </div>
                          <div className="text-xs text-white/80">
                            {message.address}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/80 mt-2">
                            <Clock className="h-3 w-3" />
                            <span>{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}