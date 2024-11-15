import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            スタッフアサイン管理システム
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            建設現場の荷揚げ業務における効率的なスタッフ配置と
            シフト管理を実現するシステムです。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>シフト管理</CardTitle>
              <CardDescription>
                スタッフのシフトを効率的に管理し、最適な人員配置を実現します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/shifts">
                <Button className="w-full">
                  シフト管理へ
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>スタッフ管理</CardTitle>
              <CardDescription>
                スタッフの情報やスキルを一元管理し、適切な人材配置を支援します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/staff">
                <Button className="w-full">
                  スタッフ管理へ
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building2 className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>現場管理</CardTitle>
              <CardDescription>
                作業場所の情報を管理し、必要な人員配置を計画します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/locations">
                <Button className="w-full">
                  現場管理へ
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}