
import React, { useEffect, useRef, useCallback } from 'react';
import { Particle, Firework } from '../types';

interface FireworksProps {
  burstTrigger?: number;
  soundEnabled?: boolean;
}

const Fireworks: React.FC<FireworksProps> = ({ burstTrigger = 0, soundEnabled = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworks = useRef<Firework[]>([]);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // 音频资源预加载
  
  
  useEffect(() => {
    // 仅视觉效果，不做音频初始化
    return () => {};
  }, []);

  

  const colors = [
    '#ff0043', '#14ff00', '#00e7ff', '#ff8e00', '#9c00ff', '#f0ff00', '#ffffff', '#ffd700', '#ff69b4', '#00fa9a'
  ];

  const createParticles = (x: number, y: number, color: string) => {
    // 不播放音效

    const count = 80 + Math.floor(Math.random() * 70);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1; 
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: Math.random() * 2 + 0.5,
        gravity: 0.06,
        friction: 0.97 
      });
    }
  };

  const launchFirework = useCallback((options?: { x?: number, y?: number, targetY?: number, speed?: number, color?: string }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 不播放音效

    fireworks.current.push({
      x: options?.x ?? Math.random() * canvas.width,
      y: options?.y ?? canvas.height,
      targetY: options?.targetY ?? Math.random() * (canvas.height * 0.5),
      vx: (Math.random() - 0.5) * 4,
      vy: options?.speed ? -options.speed : -(Math.random() * 8 + 12),
      color: options?.color ?? colors[Math.floor(Math.random() * colors.length)],
      exploded: false
    });
  }, [soundEnabled]);

  const triggerCelebration = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const waves = 4;
    const countPerWave = 20;
    
    for (let w = 0; w < waves; w++) {
      setTimeout(() => {
        for (let i = 0; i < countPerWave; i++) {
          setTimeout(() => {
            launchFirework({
              x: Math.random() * canvas.width,
              targetY: Math.random() * (canvas.height * 0.7),
              speed: Math.random() * 12 + 10
            });
          }, i * 30);
        }
      }, w * 500);
    }
  }, [launchFirework]);

  useEffect(() => {
    if (burstTrigger > 0) {
      triggerCelebration();
    }
  }, [burstTrigger, triggerCelebration]);

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.12)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = fireworks.current.length - 1; i >= 0; i--) {
      const fw = fireworks.current[i];
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.vy += 0.15;

      if (fw.vy >= 0 || fw.y <= fw.targetY) {
        createParticles(fw.x, fw.y, fw.color);
        fireworks.current.splice(i, 1);
      } else {
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = fw.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.008;

      if (p.alpha <= 0) {
        particles.current.splice(i, 1);
      } else {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        const flicker = Math.random() > 0.1 ? 1 : 0.5;
        ctx.globalAlpha = p.alpha * flicker;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    animationFrameId.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    animationFrameId.current = requestAnimationFrame(update);
    
    const interval = setInterval(() => {
      launchFirework();
      if (Math.random() > 0.7) {
        setTimeout(() => launchFirework(), 150);
      }
    }, 400);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      clearInterval(interval);
    };
  }, [launchFirework]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

export default Fireworks;
