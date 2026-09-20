'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
};

const FadeUpStagger = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial='hidden'
      animate='show'
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const FadeUpDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, children }, ref) => (
    <motion.div className={className} variants={FADE_UP_ANIMATION_VARIANTS}>
      {children}
    </motion.div>
  ),
);
FadeUpDiv.displayName = 'FadeUpDiv';

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '-8% 0px -8% 0px' },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className={cn('mobile-scroll-item', isVisible && 'mobile-scroll-item-visible', className)}>
      {children}
    </div>
  );
}

export { FADE_UP_ANIMATION_VARIANTS, FadeUpStagger, FadeUpDiv, ScrollReveal };
