'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Staff {
  id: number;
  name: string;
  phone: string;
  address: string;
  skills: string;
  status: 'active' | 'inactive' | 'retired';
}

interface StaffListProps {
  initialStaff: Staff[];
}

export function StaffList({ initialStaff }: StaffListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getSkillsArray = (skillsString: string) => {
    return skillsString ? skillsString.split(',') : [];
  };

  const filteredStaff = initialStaff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSkillsArray(member.skills).some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      member.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'outline';
      case 'retired':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '稼働中';
      case 'inactive':
        return '待機中';
      case 'retired':
        return '退職';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Input
            placeholder="名前、スキル、電話番号で検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            <SelectItem value="active">稼働中</SelectItem>
            <SelectItem value="inactive">待機中</SelectItem>
            <SelectItem value="retired">退職</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{member.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(member.status)}>
                  {getStatusText(member.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>スキル: {getSkillsArray(member.skills).join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{member.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <Button className="w-full" variant="outline">
                  詳細を見る
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}