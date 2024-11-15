import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShiftBoard } from './ShiftBoard';
import { getShiftsForDate } from '../actions/getShifts';
import { getStaff } from '../actions/getStaff';
import { getLocations } from '../actions/getLocations';

export async function ShiftTabs() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayShifts, yesterdayShifts, tomorrowShifts] = await Promise.all([
    getShiftsForDate(today),
    getShiftsForDate(yesterday),
    getShiftsForDate(tomorrow)
  ]);

  const [staff, locations] = await Promise.all([
    getStaff(),
    getLocations()
  ]);

  return (
    <Tabs defaultValue="today" className="space-y-4">
      <TabsList>
        <TabsTrigger value="yesterday">前日</TabsTrigger>
        <TabsTrigger value="today">当日</TabsTrigger>
        <TabsTrigger value="tomorrow">翌日</TabsTrigger>
      </TabsList>

      <TabsContent value="today">
        <ShiftBoard 
          shifts={todayShifts}
          staff={staff}
          locations={locations}
          date={today}
        />
      </TabsContent>

      <TabsContent value="yesterday">
        <ShiftBoard 
          shifts={yesterdayShifts}
          staff={staff}
          locations={locations}
          date={yesterday}
        />
      </TabsContent>

      <TabsContent value="tomorrow">
        <ShiftBoard 
          shifts={tomorrowShifts}
          staff={staff}
          locations={locations}
          date={tomorrow}
        />
      </TabsContent>
    </Tabs>
  );
}