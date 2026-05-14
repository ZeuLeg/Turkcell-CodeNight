import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const { logout, isMockMode } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        {isMockMode && (
          <span className="ml-4 inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            Mock Modu
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600">
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>
    </header>
  );
}
