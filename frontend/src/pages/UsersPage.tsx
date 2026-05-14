import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserTable } from '@/components/users/UserTable';
import { InviteUserModal } from '@/components/users/InviteUserModal';

export default function UsersPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Lift state up to manage users globally in the page for the mock
  const [users, setUsers] = useState([
    { id: 1, name: 'Ayşenur Yılmaz', email: 'aysenur@turkcell.com.tr', role: 'admin', isActive: true, lastLogin: '10 dk önce' },
    { id: 2, name: 'Ahmet Demir', email: 'ahmet.demir@turkcell.com.tr', role: 'editor', isActive: true, lastLogin: '2 saat önce' },
    { id: 3, name: 'Mehmet Çelik', email: 'mehmet.c@turkcell.com.tr', role: 'user', isActive: false, lastLogin: '3 gün önce' },
    { id: 4, name: 'Zeynep Kaya', email: 'zeynep.kaya@turkcell.com.tr', role: 'user', isActive: true, lastLogin: '1 gün önce' },
  ]);

  const handleInviteUser = (newUser: { email: string; role: string }) => {
    const name = newUser.email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    
    setUsers([...users, {
      id: Date.now(),
      name: name || 'Yeni Kullanıcı',
      email: newUser.email,
      role: newUser.role,
      isActive: true,
      lastLogin: 'Hiç giriş yapmadı',
    }]);
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const handleChangeRole = (id: number, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Sisteme erişimi olan kullanıcıları, rollerini ve durumlarını yönetin.</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Kullanıcı Davet Et
        </Button>
      </div>

      <div className="flex-1 bg-white border rounded-xl shadow-sm overflow-hidden">
        <UserTable 
          users={users} 
          onToggleStatus={handleToggleStatus} 
          onChangeRole={handleChangeRole} 
        />
      </div>

      <InviteUserModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onInvite={handleInviteUser}
      />
    </div>
  );
}
