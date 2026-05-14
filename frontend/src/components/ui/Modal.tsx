import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className={cn("relative z-50 w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all", className)}>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold leading-6 text-slate-900">
            {title}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
        
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
