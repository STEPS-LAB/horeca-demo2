'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-stone-900 text-stone-25 hover:bg-stone-800 active:bg-stone-950 shadow-button',
  secondary:
    'bg-stone-100 text-stone-800 hover:bg-stone-200 active:bg-stone-300',
  ghost:
    'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900',
  outline:
    'border border-stone-300 bg-transparent text-stone-700 hover:border-stone-500 hover:bg-stone-50',
  gold:
    'gradient-gold text-stone-950 shadow-button hover:opacity-90 focus-visible:ring-stone-900/70',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-8 text-base gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      href,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const cls = cn(
      'inline-flex items-center justify-center font-medium rounded-lg',
      href && !isDisabled ? 'transition-[color,background-color,border-color,opacity,transform] duration-150 ease-out' : 'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    );

    const inner =
      isLoading ? (
        <>
          <LoadingSpinner size={size} />
          <span className="opacity-70">Please wait…</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      );

    if (href && !isDisabled) {
      return (
        <Link href={href} className={cn(cls, 'hover:scale-[1.02] active:scale-[0.98]')}>
          {inner}
        </Link>
      );
    }

    const motionInteractive = {
      whileHover: isDisabled ? undefined : { scale: 1.02 },
      whileTap: isDisabled ? undefined : { scale: 0.98 },
      transition: { duration: 0.15, ease: 'easeOut' as const },
    };

    return (
      <motion.button ref={ref} className={cls} disabled={isDisabled} {...motionInteractive} {...props}>
        {inner}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;
  return (
    <svg
      className="animate-spin shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={spinnerSize}
      height={spinnerSize}
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
