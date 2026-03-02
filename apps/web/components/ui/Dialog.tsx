import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

interface DialogContentProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onClose: () => void;
}

interface DialogHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
}

interface DialogFooterProps {
  children: ReactNode;
}

interface DialogBodyProps {
  children: ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
}: DialogProps) {
  if (!open) return null;

  return (
    <DialogOverlay onClose={() => onOpenChange(false)}>
      <DialogContent size={size} onClose={() => onOpenChange(false)}>
        <DialogHeader title={title} description={description} onClose={() => onOpenChange(false)} />
        {children}
      </DialogContent>
    </DialogOverlay>
  );
}

function DialogOverlay({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

function DialogContent({ children, size = 'md', onClose }: DialogContentProps) {
  const sizes = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
  };

  return (
    <div
      className={cn(
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
        'bg-white rounded-lg shadow-2xl',
        sizes[size],
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function DialogHeader({ title, description, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-creme2">
      <div>
        <h2 className="text-xl font-serif font-bold text-encre">{title}</h2>
        {description && <p className="text-sm text-encre3 mt-1">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-encre3 hover:text-encre transition"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-creme2">
      {children}
    </div>
  );
}

export function DialogBody({ children }: DialogBodyProps) {
  return <div className="px-6 py-4">{children}</div>;
}
