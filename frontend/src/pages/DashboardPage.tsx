import React from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { StationMap } from '@/components/map/StationMap';
import { AlarmTable } from '@/components/alarms/AlarmTable';

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Top section: Summary Cards */}
      <section>
        <SummaryCards />
      </section>

      {/* Main section: Map and Alarms */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Map takes 2 columns on large screens */}
        <div className="lg:col-span-2 h-full min-h-[400px]">
          <StationMap />
        </div>
        
        {/* Alarms take 1 column on large screens */}
        <div className="h-full">
          <AlarmTable />
        </div>
      </section>
    </div>
  );
}
