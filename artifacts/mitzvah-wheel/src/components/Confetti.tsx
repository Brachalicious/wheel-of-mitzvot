import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  shape: 'star' | 'circle' | 'square';
}

const COLORS = ['#f9a825', '#1a237e', '#b71c1c', '#004d40', '#ffffff'];

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Initialize particles
    const newParticles: Particle[] = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -20 - Math.random() * 20, // start above screen
      size: 5 + Math.random() * 15, // px
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1 + Math.random() * 2,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.6 ? 'star' : (Math.random() > 0.5 ? 'circle' : 'square')
    }));

    setParticles(newParticles);

    // Animate
    let animationFrame: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 16; // normalize to roughly 60fps
      lastTime = time;

      setParticles(prev => {
        let activeCount = 0;
        const updated = prev.map(p => {
          if (p.y > 120) return p; // off screen
          activeCount++;
          return {
            ...p,
            x: p.x + p.vx * dt * 0.5,
            y: p.y + p.vy * dt,
            vy: p.vy + 0.05 * dt, // gravity
            rotation: p.rotation + p.vr * dt
          };
        });
        
        // Stop animating when all particles are off screen
        if (activeCount === 0) return prev;
        return updated;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => {
        if (p.y > 120) return null;
        
        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          >
            {p.shape === 'star' ? (
              <svg viewBox="0 0 24 24" fill={p.color} width="100%" height="100%">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : p.shape === 'circle' ? (
              <div className="w-full h-full rounded-full" style={{ backgroundColor: p.color }} />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: p.color }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
