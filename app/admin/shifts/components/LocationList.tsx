'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droppable } from '@hello-pangea/dnd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LocationCard } from './LocationCard';
import type { Location, Shift } from '../types';

interface LocationListProps {
  locations: Location[];
  shifts: Shift[];
  date: Date;
}

export function LocationList({ locations, shifts, date }: LocationListProps) {
  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader>
        <CardTitle>現場一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {locations.map((location) => (
              <Droppable key={location.id} droppableId={`location-${location.id}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <LocationCard
                      location={location}
                      shifts={shifts.filter(s => s.location_id === location.id)}
                      date={date}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}