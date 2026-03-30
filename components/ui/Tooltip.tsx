'use client';

import { useState, useRef, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  className?: string;
}

const placementStyles: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPlacement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-stone-800 border-t-4 border-x-transparent border-x-4 border-b-0',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-stone-800 border-b-4 border-x-transparent border-x-4 border-t-0',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-stone-800 border-l-4 border-y-transparent border-y-4 border-r-0',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-stone-800 border-r-4 border-y-transparent border-y-4 border-l-0',
};

const motionVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function Tooltip({
  content,
  placement = 'top',
  delay = 300,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Clone child and add aria-describedby */}
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={motionVariants}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 pointer-events-none',
              'max-w-[320px] min-w-[120px]',
              placementStyles[placement]
            )}
          >
            <div
              className={cn(
                'bg-stone-800 text-stone-50 text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-normal break-words leading-relaxed shadow-lg',
                className
              )}
            >
              {content}
            </div>
            <span
              className={cn('absolute w-0 h-0 border-solid', arrowStyles[placement])}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
