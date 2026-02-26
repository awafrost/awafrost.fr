'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  left: number;
  delay: number;
  duration: number;
  angle: number;
}

interface Meteor {
  id: number;
  left: number;
  duration: number;
  angle: number;
  size: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function StarsRain() {
  const [stars, setStars] = useState<Star[]>([]);
  const [starId, setStarId] = useState(0);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [meteorId, setMeteorId] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleId, setParticleId] = useState(0);

  // Étoiles qui tombent
  useEffect(() => {
    const interval = setInterval(() => {
      const newStar: Star = {
        id: starId,
        left: Math.random() * 100,
        delay: 0,
        duration: 2 + Math.random() * 2,
        angle: (Math.random() - 0.5) * 60,
      };

      setStars((prev) => [...prev, newStar]);
      setStarId((prev) => prev + 1);

      setTimeout(() => {
        // Créer l'effet d'explosion avec particules
        const explosionX = window.innerWidth * (newStar.left / 100);
        const explosionY = window.innerHeight;
        
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6;
          const newParticle: Particle = {
            id: particleId + i,
            x: explosionX,
            y: explosionY,
            vx: Math.cos(angle) * 300,
            vy: Math.sin(angle) * 300,
          };
          setParticles((prev) => [...prev, newParticle]);
        }
        setParticleId((prev) => prev + 6);

        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, newStar.duration * 1000);
    }, 800); // Réduit à 800ms pour moins d'étoiles

    return () => clearInterval(interval);
  }, [starId, particleId]);

  // Météorites qui tombent
  useEffect(() => {
    const interval = setInterval(() => {
      const newMeteor: Meteor = {
        id: meteorId,
        left: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        angle: (Math.random() - 0.5) * 40,
        size: 20 + Math.random() * 15,
      };

      setMeteors((prev) => [...prev, newMeteor]);
      setMeteorId((prev) => prev + 1);

      setTimeout(() => {
        // Créer l'effet d'explosion dramatique pour la météorite
        const explosionX = window.innerWidth * (newMeteor.left / 100);
        const explosionY = window.innerHeight;
        
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 * i) / 12;
          const newParticle: Particle = {
            id: particleId + i,
            x: explosionX,
            y: explosionY,
            vx: Math.cos(angle) * 500,
            vy: Math.sin(angle) * 500,
          };
          setParticles((prev) => [...prev, newParticle]);
        }
        setParticleId((prev) => prev + 12);

        setMeteors((prev) => prev.filter((m) => m.id !== newMeteor.id));
      }, newMeteor.duration * 1000);
    }, 3500); // Météorite toutes les 3.5 secondes

    return () => clearInterval(interval);
  }, [meteorId, particleId]);

  // Animé les particules et nettoyer
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.016,
            y: p.y + p.vy * 0.016,
            vy: p.vy + 500 * 0.016, // Gravité
          }))
          .filter((p) => p.y < window.innerHeight && p.x > 0 && p.x < window.innerWidth)
      );
    }, 16);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Étoiles qui tombent */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-white"
          initial={{
            top: '-20px',
            left: `${star.left}%`,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            top: '100vh',
            left: `calc(${star.left}% + ${Math.tan((star.angle * Math.PI) / 180) * 100}px)`,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: star.duration,
            ease: 'linear',
          }}
        >
          <svg
            className="w-4 h-4 drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      ))}

      {/* Météorites qui tombent */}
      {meteors.map((meteor) => (
        <motion.div
          key={`meteor-${meteor.id}`}
          className="absolute"
          initial={{
            top: '-30px',
            left: `${meteor.left}%`,
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          animate={{
            top: '100vh',
            left: `calc(${meteor.left}% + ${Math.tan((meteor.angle * Math.PI) / 180) * 150}px)`,
            opacity: 0,
            scale: 0,
            rotate: 360,
          }}
          transition={{
            duration: meteor.duration,
            ease: 'linear',
          }}
        >
          <div 
            style={{
              width: meteor.size,
              height: meteor.size,
            }}
            className="bg-orange-400 rounded-full drop-shadow-2xl shadow-orange-500"
          />
        </motion.div>
      ))}

      {/* Particules d'explosion */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: 0.8,
          }}
          animate={{
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
