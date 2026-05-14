import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, RadioTower, BellRing, ActivitySquare, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'İstasyonlar', path: '/stations', icon: RadioTower },
  { name: 'Alarmlar', path: '/alarms', icon: BellRing },
  { name: 'Simülatör', path: '/simulator', icon: ActivitySquare },
  { name: 'Kullanıcılar', path: '/users', icon: Users },
  { name: 'Ayarlar', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-900 text-slate-100">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <RadioTower className="h-6 w-6 text-primary mr-2" />
        <span className="text-xl font-bold tracking-tight">TelcoGuard</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
