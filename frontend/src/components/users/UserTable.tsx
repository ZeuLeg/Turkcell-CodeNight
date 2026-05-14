import { cn } from '@/lib/utils';
import { Mail, Shield, ShieldAlert, Wrench, BarChart2 } from 'lucide-react';

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Sistem Yöneticisi',
    icon: ShieldAlert,
    color: 'text-red-500',
    badge: 'bg-red-50 text-red-700',
  },
  MANAGER: {
    label: 'Şebeke Yöneticisi',
    icon: BarChart2,
    color: 'text-purple-500',
    badge: 'bg-purple-50 text-purple-700',
  },
  NOC: {
    label: 'NOC Operatörü',
    icon: Shield,
    color: 'text-blue-500',
    badge: 'bg-blue-50 text-blue-700',
  },
  FIELD_ENGINEER: {
    label: 'Saha Mühendisi',
    icon: Wrench,
    color: 'text-orange-500',
    badge: 'bg-orange-50 text-orange-700',
  },
} as const;

type BackendRole = keyof typeof ROLE_CONFIG;

export interface UserData {
  id: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: UserData[];
}

function nameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
          <tr>
            <th className="px-6 py-4 font-semibold">Kullanıcı</th>
            <th className="px-6 py-4 font-semibold">Rol</th>
            <th className="px-6 py-4 font-semibold">Kullanıcı ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const cfg = ROLE_CONFIG[user.role as BackendRole];
            const Icon = cfg?.icon ?? Shield;
            return (
              <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base">
                      {nameFromEmail(user.email).charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{nameFromEmail(user.email)}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg?.badge ?? 'bg-slate-100 text-slate-600')}>
                    <Icon className={cn('w-3.5 h-3.5', cfg?.color)} />
                    {cfg?.label ?? user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-slate-400">{user.id.slice(0, 8)}…</span>
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-sm">
                Sistemde hiç kullanıcı bulunmuyor.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
