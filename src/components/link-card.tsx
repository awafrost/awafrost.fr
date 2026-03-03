'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FADE_UP_ANIMATION_VARIANTS } from './animation';

interface LinkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
}

const LinkCard = React.forwardRef<HTMLButtonElement, LinkCardProps>(
  ({ className, children, href }, ref) => {
    const handleClick = () => {
      window.location.href = href;
    };
    return (
      <motion.button
        ref={ref as any}
        className={cn('rounded-xl border bg-card text-card-foreground shadow cursor-pointer', className)}
        onClick={handleClick}
        onTouchEnd={handleClick}
        variants={FADE_UP_ANIMATION_VARIANTS}
        style={{ pointerEvents: 'auto' }}
      >
        {children}
      </motion.button>
    );
  },
);
LinkCard.displayName = 'CardIcon';

export { LinkCard };
