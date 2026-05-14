import { useEffect, useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserTable, UserData } from '@/components/users/UserTable';
import { InviteUserModal } from '@/components/users/InviteUserModal';
import { api } from '@/api/client';
import { ApiResponse } from '@/types/api.types';
import { PageHeader } from '@/components/ui/PageHeader';

const ROLE_COUNTS: Record<string, { label: string; color: string; bg: string }> = {
  ADMIN:          { label: 'Sistem Yöneticisi',  color: 'text-red-700',    bg: 'bg-red-50' },
  MANAGER:        { label: 'Şebeke Yöneticisi',  color: 'text-purple-700', bg: 'bg-purple-50' },
  NOC:            { label: 'NOC Operatörü',      color: 'text-blue-700',   bg: 'bg-blue-50' },
  FIELD_ENGINEER: { label: 'Saha Mühendisi',     color: 'text-orange-700', bg: 'bg-orange-50' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    api.get<ApiResponse<UserData[]>>('/api/v1/users')
      .then((res) => {
        setUsers(res.data ?? []);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInviteUser = async (newUser: { email: string; role: string }) => {
    try {
      await api.post('/api/v1/auth/register', {
        email: newUser.email,
        password: 'telco1234',
        role: newUser.role,
      });
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kullanıcı eklenemedi');
    }
  };

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col space-y-6 h-full">
      <PageHeader
        title="Kullanıcı Yönetimi"
        description="Sisteme erişimi olan kullanıcıları ve rollerini görüntüleyin."
      />

      {/* Rol özet kartları */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(ROLE_COUNTS).map(([role, cfg]) => (
          <div key={role} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
              <Users className={`h-5 w-5 ${cfg.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{roleCounts[role] ?? 0}</p>
              <p className="text-xs text-slate-500">{cfg.label}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Toplam <span className="font-semibold text-slate-800">{users.length}</span> kullanıcı</p>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Kullanıcı Ekle
        </Button>
      </div>

      <div className="flex-1 bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Yükleniyor...</div>
        ) : (
          <UserTable users={users} />
        )}
      </div>

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </div>
  );
}
