'use client';

import * as React from 'react';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Button ───────────────────────────────────────────────────
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  default: 'bg-[#1e3a5f] text-white hover:bg-[#162b47] shadow-sm',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  ghost: 'hover:bg-gray-100 text-gray-700',
  link: 'text-[#1e3a5f] underline-offset-4 hover:underline p-0 h-auto',
};
const sizeClasses: Record<string, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-7 px-3 text-xs',
  lg: 'h-11 px-8',
  icon: 'h-9 w-9',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

// ─── Badge ────────────────────────────────────────────────────
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}
const badgeVariants: Record<string, string> = {
  default: 'bg-[#1e3a5f] text-white',
  secondary: 'bg-gray-100 text-gray-700',
  destructive: 'bg-red-100 text-red-700',
  outline: 'border border-gray-300 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
};
export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', badgeVariants[variant], className)} {...props} />
);

// ─── Card ─────────────────────────────────────────────────────
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)} {...props} />
);
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-5 pb-0', className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('font-semibold text-gray-900', className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5', className)} {...props} />
);

// ─── Input ────────────────────────────────────────────────────
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn('flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:opacity-50', className)}
      {...props}
    />
  )
);
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none disabled:opacity-50', className)}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

// ─── Select ───────────────────────────────────────────────────
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn('flex h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] disabled:opacity-50', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  )
);
Select.displayName = 'Select';

// ─── Label ────────────────────────────────────────────────────
export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('block text-sm font-medium text-gray-700 mb-1', className)} {...props} />
);

// ─── Spinner ──────────────────────────────────────────────────
export const Spinner = ({ className }: { className?: string }) => (
  <Loader2 className={cn('animate-spin text-[#1e3a5f]', className)} />
);

// ─── Separator ────────────────────────────────────────────────
export const Separator = ({ className, orientation = 'horizontal' }: { className?: string; orientation?: 'horizontal' | 'vertical' }) => (
  <div className={cn(orientation === 'horizontal' ? 'h-px w-full bg-gray-200' : 'w-px h-full bg-gray-200', className)} />
);

// ─── Progress ─────────────────────────────────────────────────
export const Progress = ({ value = 0, className }: { value?: number; className?: string }) => (
  <div className={cn('h-2 w-full overflow-hidden rounded-full bg-gray-100', className)}>
    <div className="h-full bg-[#1e3a5f] transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────
export const Avatar = ({ src, name, className }: { src?: string; name?: string; className?: string }) => {
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return src ? (
    <img src={src} alt={name} className={cn('h-8 w-8 rounded-full object-cover', className)} />
  ) : (
    <div className={cn('h-8 w-8 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center', className)}>
      {initials}
    </div>
  );
};

// ─── Modal / Dialog ───────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, className }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; className?: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn('relative bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4', className)}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────
interface TabsContextValue { active: string; setActive: (v: string) => void }
const TabsCtx = React.createContext<TabsContextValue>({ active: '', setActive: () => {} });

export const Tabs = ({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) => {
  const [active, setActive] = React.useState(defaultValue);
  return <TabsCtx.Provider value={{ active, setActive }}><div className={cn('', className)}>{children}</div></TabsCtx.Provider>;
};
export const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('flex gap-1 border-b border-gray-200', className)}>{children}</div>
);
export const TabsTrigger = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const { active, setActive } = React.useContext(TabsCtx);
  return (
    <button
      onClick={() => setActive(value)}
      className={cn('px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors', active === value ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-700', className)}
    >
      {children}
    </button>
  );
};
export const TabsContent = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const { active } = React.useContext(TabsCtx);
  if (active !== value) return null;
  return <div className={cn('mt-4', className)}>{children}</div>;
};

// ─── Table helpers ────────────────────────────────────────────
export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto"><table className={cn('w-full text-sm', className)} {...props} /></div>
);
export const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('bg-gray-50', className)} {...props} />
);
export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('divide-y divide-gray-100', className)} {...props} />
);
export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('hover:bg-gray-50 transition-colors', className)} {...props} />
);
export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide', className)} {...props} />
);
export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-3 text-gray-700', className)} {...props} />
);
