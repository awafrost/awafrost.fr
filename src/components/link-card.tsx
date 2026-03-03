'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FADE_UP_ANIMATION_VARIANTS } from './animation';

interface LinkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
}

const LinkCard = React.forwardRef<HTMLDivElement, LinkCardProps>(
  ({ className, children, href }, ref) => {
    const handleClick = () => {
      window.open(href, '_blank');
    };
    return (
      <motion.div
        ref={ref}
        className={cn('rounded-xl border bg-card text-card-foreground shadow cursor-pointer', className)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        {children}
      </motion.div>
    );
  },
);
LinkCard.displayName = 'CardIcon';

export { LinkCard };
