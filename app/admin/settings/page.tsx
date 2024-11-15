'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">設定</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">一般設定</TabsTrigger>
          <TabsTrigger value="notifications">通知設定</TabsTrigger>
          <TabsTrigger value="users">ユーザー管理</TabsTrigger>
          <TabsTrigger value="system">システム設定</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>一般設定</CardTitle>
              <CardDescription>
                システムの基本的な設定を行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">会社名</Label>
                <Input id="company-name" defaultValue="株式会社サンプル" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">タイムゾーン</Label>
                <Select defaultValue="Asia/Tokyo">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="タイムゾーンを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                    <SelectItem value="Asia/Seoul">Asia/Seoul (UTC+9)</SelectItem>
                    <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>自動アーカイブ</Label>
                  <p className="text-sm text-muted-foreground">
                    30日以上経過した情報を自動的にアーカイブします
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>
                システムからの通知設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>メール通知</Label>
                  <p className="text-sm text-muted-foreground">
                    重要な更新をメールで受け取ります
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>LINE通知</Label>
                  <p className="text-sm text-muted-foreground">
                    緊急の連絡をLINEで受け取ります
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>起床未報告アラート</Label>
                  <p className="text-sm text-muted-foreground">
                    スタッフの起床未報告を通知します
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>ユーザー管理</CardTitle>
              <CardDescription>
                システム管理者のアクセス権限を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">管理者A</p>
                    <p className="text-sm text-muted-foreground">admin@example.com</p>
                  </div>
                  <Select defaultValue="admin">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="権限を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">管理者</SelectItem>
                      <SelectItem value="editor">編集者</SelectItem>
                      <SelectItem value="viewer">閲覧者</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  新規ユーザーを追加
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>システム設定</CardTitle>
              <CardDescription>
                システムの詳細設定を行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>データベースバックアップ</Label>
                <div className="flex gap-4">
                  <Button variant="outline">
                    今すぐバックアップ
                  </Button>
                  <Button variant="outline">
                    リストア
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>システムログ</Label>
                <div className="h-[200px] rounded-md border bg-muted p-4 font-mono text-sm">
                  [2024-04-27 10:00:00] System started
                  [2024-04-27 10:01:00] Database connected
                  [2024-04-27 10:02:00] Backup completed
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}