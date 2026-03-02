import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-outfit font-medium rounded transition duration-200 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-rouge hover:bg-rouge-mid text-white disabled:opacity-50',
    secondary: 'bg-or hover:bg-or-light text-encre disabled:opacity-50',
    outline: 'border-2 border-rouge text-rouge hover:bg-rouge hover:text-white disabled:opacity-50',
    ghost: 'text-rouge hover:bg-rouge/10 disabled:opacity-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
