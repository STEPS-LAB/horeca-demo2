'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

const inputBaseStyles = cn(
  /* text-base below sm avoids iOS Safari zoom on focus (<16px triggers zoom) */
  'w-full rounded-lg border bg-white px-3 py-2.5 text-base sm:text-sm text-stone-900',
  'placeholder:text-stone-400',
  'transition-colors duration-150',
  'focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50'
);

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
            {label}
            {props.required && <span className="ml-1 text-gold-600">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputBaseStyles,
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/40' : 'border-stone-200',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 flex items-center gap-1">
            <svg className="shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5a.5.5 0 011 0v3a.5.5 0 01-1 0v-3zm.5 5.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-stone-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-stone-700">
            {label}
            {props.required && <span className="ml-1 text-gold-600">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            inputBaseStyles,
            'resize-none min-h-[120px]',
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/40' : 'border-stone-200',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-red-500 flex items-center gap-1">
            <svg className="shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5a.5.5 0 011 0v3a.5.5 0 01-1 0v-3zm.5 5.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-stone-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-stone-700">
          {label}
          {props.required && <span className="ml-1 text-gold-600">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          inputBaseStyles,
          'appearance-none cursor-pointer',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2378716c\' stroke-width=\'2\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_10px_center] pr-9',
          error ? 'border-red-400' : 'border-stone-200',
          className
        )}
        aria-invalid={!!error}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

export { Input, Textarea, Select };
