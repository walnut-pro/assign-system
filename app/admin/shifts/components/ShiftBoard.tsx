'use client';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { StaffList } from './StaffList';
import { LocationList } from './LocationList';
import { useShiftAssignment } from '../hooks/useShiftAssignment';
import type { Staff, Location, Shift } from '../types';
import { format } from 'date-fns';

interface ShiftBoardProps {
  shifts: Shift[];
  staff: Staff[];
  locations: Location[];
  date: Date;
}

export function ShiftBoard({ shifts, staff, locations, date }: ShiftBoardProps) {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const { handleDragEnd } = useShiftAssignment(formattedDate);

  // アサイン済みのスタッフIDを取得（同じ日付のみ）
  const assignedStaffIds = new Set(
    shifts
      .filter(s => s.staff_id && s.date === formattedDate)
      .map(s => s.staff_id)
  );

  // アサイン可能なスタッフのみをフィルタリング
  const availableStaff = staff.filter(s => !assignedStaffIds.has(s.id));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <StaffList staff={availableStaff} />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={50}>
          <LocationList 
            locations={locations}
            shifts={shifts}
            date={date}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </DragDropContext>
  );
}