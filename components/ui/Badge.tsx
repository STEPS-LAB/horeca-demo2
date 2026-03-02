import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'gold' | 'success' | 'info' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-stone-900 text-stone-50',
  gold: 'bg-gold-500/15 text-gold-700 border border-gold-500/25',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  info: 'bg-sky-50 text-sky-700 border border-sky-200',
  muted: 'bg-stone-100 text-stone-500 border border-stone-200',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
