import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PAGE_TITLES: Record<string, { title: string; description?: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Canlı ağ izleme' },
  '/stations': { title: 'İstasyonlar', description: 'Baz istasyonu yönetimi' },
  '/alarms': { title: 'Alarm Yönetimi', description: 'Anomali takibi ve müdahale' },
  '/simulator': { title: 'Simülatör', description: 'Telemetri simülasyonu' },
  '/users': { title: 'Kullanıcı Yönetimi', description: 'Erişim ve roller' },
  '/regions': { title: 'Bölge Özeti', description: 'Bölgesel ağ sağlığı' },
  '/settings': { title: 'Ayarlar', description: 'Sistem yapılandırması' },
};

const CRITICAL_ALARM_COUNT = 2;

export function TopBar() {
  const { logout, isMockMode, user } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pageKey = Object.keys(PAGE_TITLES).find((key) =>
    pathname === key || (key !== '/dashboard' && pathname.startsWith(key))
  ) ?? '/dashboard';

  const pageInfo = PAGE_TITLES[pageKey];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0">
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base font-semibold text-slate-900 leading-tight">{pageInfo?.title}</h1>
          {pageInfo?.description && (
            <p className="text-xs text-slate-500 leading-tight">{pageInfo.description}</p>
          )}
        </div>
        {isMockMode && (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            Mock Modu
          </span>
        )}
      </div>

      {/* Right: Bell + User */}
      <div className="flex items-center gap-2">

        {/* Notification bell with badge */}
        <button
          onClick={() => navigate('/alarms')}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Alarmları Görüntüle"
        >
          <Bell className="h-5 w-5" />
          {CRITICAL_ALARM_COUNT > 0 && (
            <span className={cn(
              'absolute top-1 right-1 inline-flex items-center justify-center h-4 w-4 rounded-full text-[10px] font-bold text-white',
              'bg-red-500'
            )}>
              {CRITICAL_ALARM_COUNT}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-tight">{user?.name ?? 'Kullanıcı'}</p>
            <p className="text-xs text-slate-500 leading-tight">{user?.roleLabel ?? 'Misafir'}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-700 ml-1"
            title="Çıkış Yap"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1.5">Çıkış</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
