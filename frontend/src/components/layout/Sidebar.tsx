import { NavLink } from 'react-router-dom';
import { LayoutDashboard, RadioTower, BellRing, ActivitySquare, Users, Settings, Map, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, UserRole } from '@/store/auth.store';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  badgeCritical?: boolean;
  roles?: UserRole[];
  excludeRoles?: UserRole[];
}

const BASE_NAV: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'İstasyonlar', path: '/stations', icon: RadioTower },
  { name: 'Alarmlar', path: '/alarms', icon: BellRing, excludeRoles: ['field_engineer'] },
  { name: 'Görevlerim', path: '/my-tasks', icon: Wrench, roles: ['field_engineer'] },
  { name: 'Bölge Özeti', path: '/regions', icon: Map, excludeRoles: ['field_engineer'] },
  { name: 'Simülatör', path: '/simulator', icon: ActivitySquare, roles: ['admin'] },
  { name: 'Kullanıcılar', path: '/users', icon: Users, roles: ['admin'] },
  { name: 'Ayarlar', path: '/settings', icon: Settings, roles: ['admin', 'manager'] },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const role = user?.role ?? 'operator';
  const { summary } = useDashboardSummary(15000);

  const navItems = BASE_NAV.map((item) =>
    item.path === '/alarms'
      ? { ...item, badge: summary?.activeAlarms ?? 0, badgeCritical: (summary?.criticalAlarms ?? 0) > 0 }
      : item
  );

  const visibleItems = navItems.filter((item) => {
    if (item.roles && !item.roles.includes(role)) return false;
    if (item.excludeRoles && item.excludeRoles.includes(role)) return false;
    return true;
  });

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-100 shrink-0">

      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <RadioTower className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">TelcoGuard</span>
            <p className="text-[10px] text-slate-400 leading-tight">NOC Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-0.5 px-3">
          {visibleItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                    {item.name}
                  </div>
                  {item.badge != null && item.badge > 0 && (
                    <span
                      className={cn(
                        'inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-[10px] font-bold',
                        item.badgeCritical
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom: User role + system status */}
      <div className="px-4 py-4 border-t border-slate-800 space-y-2">
        {user && (
          <div className="flex items-center gap-2 text-xs">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-primary">{user.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-slate-300 font-medium truncate">{user.name}</p>
              <p className="text-slate-500 truncate">{user.roleLabel}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Simülatör aktif</span>
        </div>
        <p className="text-[10px] text-slate-600">v1.0.0 — Turkcell CodeNight 2026</p>
      </div>
    </div>
  );
}
