'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { DropResult } from '@hello-pangea/dnd';

export function useShiftAssignment(date: string) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;
    const itemId = result.draggableId;

    try {
      // スタッフ一覧から現場へのドラッグ
      if (sourceId === 'staff-list' && destinationId.startsWith('location-')) {
        const staffId = parseInt(itemId.split('-')[1]);
        const locationId = parseInt(destinationId.split('-')[1]);
        
        if (isNaN(staffId) || isNaN(locationId)) {
          throw new Error('Invalid staff or location ID');
        }
        
        await assignStaffToLocation(staffId, locationId);
      }
      // 現場からスタッフ一覧へのドラッグ（スタッフの解除）
      else if (sourceId.startsWith('location-') && destinationId === 'staff-list') {
        const shiftId = parseInt(itemId.split('-')[1]);
        
        if (isNaN(shiftId)) {
          throw new Error('Invalid shift ID');
        }
        
        await unassignStaffFromShift(shiftId);
      }
      // 現場から別の現場へのドラッグ
      else if (sourceId.startsWith('location-') && destinationId.startsWith('location-')) {
        const shiftId = parseInt(itemId.split('-')[1]);
        const newLocationId = parseInt(destinationId.split('-')[1]);
        
        if (isNaN(shiftId) || isNaN(newLocationId)) {
          throw new Error('Invalid shift or location ID');
        }
        
        await moveStaffToNewLocation(shiftId, newLocationId);
      }
    } catch (error) {
      console.error('Drag and drop error:', error);
      toast.error('スタッフの移動に失敗しました');
    }
  };

  const assignStaffToLocation = async (staffId: number, locationId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/shifts/assign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, locationId, date }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign staff');
      }

      toast.success(data.message || 'スタッフをアサインしました');
      router.refresh();
    } catch (error) {
      console.error('Error assigning staff:', error);
      toast.error(error instanceof Error ? error.message : 'スタッフのアサインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const unassignStaffFromShift = async (shiftId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/shifts/unassign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unassign staff');
      }

      toast.success(data.message || 'スタッフのアサインを解除しました');
      router.refresh();
    } catch (error) {
      console.error('Error unassigning staff:', error);
      toast.error(error instanceof Error ? error.message : 'スタッフのアサイン解除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const moveStaffToNewLocation = async (shiftId: number, newLocationId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/shifts/move', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId, newLocationId, date }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to move staff');
      }

      toast.success(data.message || 'スタッフを移動しました');
      router.refresh();
    } catch (error) {
      console.error('Error moving staff:', error);
      toast.error(error instanceof Error ? error.message : 'スタッフの移動に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDragEnd,
    unassignStaffFromShift,
    isLoading,
  };
}