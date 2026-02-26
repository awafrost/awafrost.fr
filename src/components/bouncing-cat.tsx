'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CatPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scaleX: number;
}

export function BouncingCat() {
  const catSize = 80;
  const speed = 250;

  const [catPos, setCatPos] = useState<CatPosition>({
    x: 100,
    y: 100,
    vx: speed,
    vy: speed,
    scaleX: 1,
  });

  const [shake, setShake] = useState(false);

  useEffect(() => {
    const animationLoop = setInterval(() => {
      setCatPos((prev) => {
        let newX = prev.x + prev.vx * 0.016;
        let newY = prev.y + prev.vy * 0.016;
        let newVx = prev.vx;
        let newVy = prev.vy;
        let newScaleX = prev.scaleX;

        // Rebonds sur les murs verticaux
        if (newX <= 0) {
          newX = 0;
          newVx = Math.abs(newVx);
          newScaleX = 1;
          setShake(true);
          setTimeout(() => setShake(false), 150);
        }
        if (newX >= window.innerWidth - catSize) {
          newX = window.innerWidth - catSize;
          newVx = -Math.abs(newVx);
          newScaleX = -1;
          setShake(true);
          setTimeout(() => setShake(false), 150);
        }

        // Rebonds sur les murs horizontaux
        if (newY <= 0) {
          newY = 0;
          newVy = Math.abs(newVy);
          setShake(true);
          setTimeout(() => setShake(false), 150);
        }
        if (newY >= window.innerHeight - catSize) {
          newY = window.innerHeight - catSize;
          newVy = -Math.abs(newVy);
          setShake(true);
          setTimeout(() => setShake(false), 150);
        }

        return {
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          scaleX: newScaleX,
        };
      });
    }, 16);

    return () => clearInterval(animationLoop);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: catPos.x,
        top: catPos.y,
        width: catSize,
        height: catSize,
      }}
      animate={{
        x: shake ? [0, -5, 5, -5, 0] : 0,
        y: shake ? [0, -5, 5, -5, 0] : 0,
        scaleX: catPos.scaleX,
      }}
      transition={{
        duration: shake ? 0.2 : 0.1,
      }}
    >
      <Image
        src="/icons/cat.gif"
        alt="Bouncing cat screensaver"
        width={catSize}
        height={catSize}
        className="w-full h-full object-contain"
        priority
        unoptimized
      />
    </motion.div>
  );
}
