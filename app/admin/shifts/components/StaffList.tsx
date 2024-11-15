'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Staff } from '../types';

interface StaffListProps {
  staff: Staff[];
}

export function StaffList({ staff }: StaffListProps) {
  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader>
        <CardTitle>スタッフ一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Droppable droppableId="staff-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {staff.map((member, index) => (
                  <Draggable
                    key={member.id}
                    draggableId={`staff-${member.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 rounded-lg border ${
                          snapshot.isDragging ? 'bg-accent' : 'bg-card'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{member.name}</span>
                            <Badge variant="outline">
                              {member.skills.split(',')[0]}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.address}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}