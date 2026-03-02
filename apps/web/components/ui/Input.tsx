import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helper?: string;
}

export function Input({
  label,
  error,
  icon,
  helper,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-outfit font-medium text-encre"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border-2 transition',
            'font-outfit text-encre placeholder-encre3',
            'focus:outline-none focus:border-rouge focus:ring-1 focus:ring-rouge',
            'disabled:bg-creme2 disabled:text-encre3 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-creme2 hover:border-encre3',
            icon && 'pl-10',
            className,
          )}
          {...props}
        />

        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helper ? (
        <p className="text-sm text-encre3">{helper}</p>
      ) : null}
    </div>
  );
}
