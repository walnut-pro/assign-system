'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import type { Location, Shift } from '../types';
import { useShiftConfirmation } from '../hooks/useShiftConfirmation';
import { useShiftAssignment } from '../hooks/useShiftAssignment';

interface LocationCardProps {
  location: Location;
  shifts: Shift[];
  date: Date;
}

export function LocationCard({ location, shifts, date }: LocationCardProps) {
  const { confirmShift, cancelConfirmation, isLoading: isConfirmLoading } = useShiftConfirmation();
  const { unassignStaffFromShift, isLoading: isUnassignLoading } = useShiftAssignment(date.toISOString().split('T')[0]);

  const assignedStaffCount = shifts.filter(s => s.staff_id).length;
  const isFullyAssigned = assignedStaffCount >= location.required_staff;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{location.name}</CardTitle>
          <Badge variant={isFullyAssigned ? 'default' : 'outline'}>
            アサイン: {assignedStaffCount}/{location.required_staff}名
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{location.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>必要人数: {location.required_staff}名</span>
          </div>
          <div className="space-y-2">
            {shifts.filter(s => s.staff_id).map((shift, index) => (
              <Draggable
                key={shift.id}
                draggableId={`shift-${shift.id}`}
                index={index}
                isDragDisabled={shift.status === 'confirmed'}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-2 rounded-md ${
                      snapshot.isDragging ? 'bg-accent' : 'bg-background'
                    } flex justify-between items-center`}
                  >
                    <span>{shift.staff_name}</span>
                    <div className="flex gap-2">
                      {shift.status === 'confirmed' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelConfirmation(shift.id)}
                          disabled={isConfirmLoading}
                        >
                          キャンセル
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => unassignStaffFromShift(shift.id)}
                            disabled={isUnassignLoading}
                          >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            戻す
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => confirmShift(shift.id)}
                            disabled={isConfirmLoading}
                          >
                            確定
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}