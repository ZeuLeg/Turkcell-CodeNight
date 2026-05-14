import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Mail, Shield } from 'lucide-react';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (user: { email: string; role: string }) => void;
}

export function InviteUserModal({ isOpen, onClose, onInvite }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onInvite({ email, role });
      setEmail('');
      setRole('user');
      setIsLoading(false);
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Kullanıcı Davet Et">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="invite-email">E-posta Adresi</Label>
          <Input 
            id="invite-email" 
            type="email" 
            placeholder="ornek@turkcell.com.tr" 
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="invite-role">Kullanıcı Rolü</Label>
          <div className="relative">
            <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="user">Standart Kullanıcı (User)</option>
              <option value="editor">Düzenleyici (Editor)</option>
              <option value="admin">Sistem Yöneticisi (Admin)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-2 border-t mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button type="submit" disabled={isLoading || !email}>
            {isLoading ? 'Davet Gönderiliyor...' : 'Daveti Gönder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
