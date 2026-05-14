import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Mail, Shield, ShieldAlert, User } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
}

interface UserTableProps {
  users: UserData[];
  onToggleStatus: (id: number) => void;
  onChangeRole: (id: number, newRole: string) => void;
}

export function UserTable({ users, onToggleStatus, onChangeRole }: UserTableProps) {
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return <ShieldAlert className="w-4 h-4 text-red-500 mr-2" />;
      case 'editor': return <Shield className="w-4 h-4 text-amber-500 mr-2" />;
      default: return <User className="w-4 h-4 text-blue-500 mr-2" />;
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
          <tr>
            <th className="px-6 py-4 font-semibold">Kullanıcı</th>
            <th className="px-6 py-4 font-semibold">Rol</th>
            <th className="px-6 py-4 font-semibold">Son Giriş</th>
            <th className="px-6 py-4 font-semibold">Durum (Aktif)</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-slate-500 flex items-center mt-0.5 text-xs">
                      <Mail className="w-3 h-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {getRoleIcon(user.role)}
                  <select 
                    className="bg-transparent border-0 text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer"
                    value={user.role}
                    onChange={(e) => onChangeRole(user.id, e.target.value)}
                  >
                    <option value="admin">Sistem Yöneticisi</option>
                    <option value="editor">Düzenleyici</option>
                    <option value="user">Standart Kullanıcı</option>
                  </select>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-500">
                {user.lastLogin}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <button 
                    type="button" 
                    onClick={() => onToggleStatus(user.id)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      user.isActive ? "bg-emerald-500" : "bg-slate-200"
                    )}
                  >
                    <span className="sr-only">Toggle status</span>
                    <span 
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        user.isActive ? "translate-x-5" : "translate-x-0"
                      )} 
                    />
                  </button>
                  <Badge variant={user.isActive ? 'default' : 'secondary'} className={user.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : ''}>
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                Sistemde hiç kullanıcı bulunmuyor.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
