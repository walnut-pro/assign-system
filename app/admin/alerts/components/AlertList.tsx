'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useAlertConfirmation } from '../hooks/useAlertConfirmation';

interface Alert {
  shift_id: number;
  staff_id: number;
  staff_name: string;
  location_name: string;
  date: string;
  status: '未連絡' | '報告済み';
  reported_at?: string;
}

interface AlertListProps {
  initialAlerts: Alert[];
}

export function AlertList({ initialAlerts }: AlertListProps) {
  const { confirmAlert, loading } = useAlertConfirmation();

  const unconfirmedAlerts = initialAlerts.filter(alert => alert.status === '未連絡');
  const confirmedAlerts = initialAlerts.filter(alert => alert.status === '報告済み');

  return (
    <div className="grid gap-4">
      {unconfirmedAlerts.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-600 dark:text-red-400">
                未確認の起床報告
              </CardTitle>
              <Badge variant="destructive">{unconfirmedAlerts.length}件</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unconfirmedAlerts.map((alert) => (
                <div
                  key={`${alert.shift_id}-${alert.staff_id}`}
                  className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium">{alert.staff_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.location_name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="ml-auto"
                    onClick={() => confirmAlert(alert.shift_id)}
                    disabled={loading}
                  >
                    確認
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {confirmedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>起床報告済み</CardTitle>
              <Badge variant="secondary">{confirmedAlerts.length}件</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmedAlerts.map((alert) => (
                <div
                  key={`${alert.shift_id}-${alert.staff_id}`}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium">{alert.staff_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.location_name}
                      </p>
                    </div>
                  </div>
                  {alert.reported_at && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(alert.reported_at), 'HH:mm')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}