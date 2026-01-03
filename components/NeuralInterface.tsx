/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

/**
 * @file NeuralInterface.tsx
 * @author Ashraf Morningstar <https://github.com/AshrafMorningstar>
 * @copyright 2025 Ashraf Morningstar
 * @license MIT
 *
 * 🌌 QubitFlow OS - The Quantum Computing Interface
 * "The future is unwritten, but the code is compiled."
 */

import React, { useEffect, useRef } from 'react';

interface NeuralInterfaceProps {
  theme: 'dark' | 'light';
}

const NeuralInterface: React.FC<NeuralInterfaceProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particleCount = theme === 'dark' ? 120 : 60;
    const connectionDistance = 180;
    const pulseSpeed = 2;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;
      pulse: number; // 0 to 1
      pulseDir: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.pulse = Math.random();
        this.pulseDir = 0.01;
      }

      update(mouseX: number, mouseY: number) {
        // Pulse effect
        this.pulse += this.pulseDir;
        if (this.pulse > 1 || this.pulse < 0.2) this.pulseDir *= -1;

        // Mouse Drift
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 300;

        if (distance < maxDist) {
            const force = (maxDist - distance) / maxDist;
            const dirX = dx / distance;
            const dirY = dy / distance;
            this.x -= dirX * force * 1.5;
            this.y -= dirY * force * 1.5;
        } else {
             // Return to base, slowly
             if (this.x !== this.baseX) this.x -= (this.x - this.baseX) * 0.01;
             if (this.y !== this.baseY) this.y -= (this.y - this.baseY) * 0.01;
        }

        // Base Movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > width) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Quantum Glow Color
        if (theme === 'dark') {
            ctx.fillStyle = `rgba(0, 240, 255, ${this.pulse})`; // Neuro Cyan
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00F0FF';
        } else {
            ctx.fillStyle = `rgba(50, 50, 150, ${this.pulse})`;
            ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        if (!ctx) return;
        // Trail effect
        ctx.fillStyle = theme === 'dark' ? 'rgba(3, 0, 20, 0.2)' : 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, width, height);

        // Draw Grid (Subtle Background)
        if (theme === 'dark') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 0.5;
            const gridSize = 50;
            const offset = (Date.now() / 50) % gridSize;
            
            // Perpendicular moving grid
            // const yOffset = (Date.now() / 50) % gridSize;
            // for(let x=0; x<width; x+=gridSize) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,height); ctx.stroke(); }
            // for(let y=offset; y<height; y+=gridSize) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke(); }
        }

        particles.forEach(p => {
            p.update(mouseRef.current.x, mouseRef.current.y);
            p.draw();
        });

        // Draw Connections
        particles.forEach((a, index) => {
            for (let j = index + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    const opacity = 1 - (distance / connectionDistance);
                    
                    if (theme === 'dark') {
                         const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                         gradient.addColorStop(0, `rgba(0, 240, 255, ${opacity * a.pulse})`);
                         gradient.addColorStop(1, `rgba(188, 19, 254, ${opacity * b.pulse})`);
                         ctx.strokeStyle = gradient;
                         ctx.lineWidth = 1;
                    } else {
                        ctx.strokeStyle = `rgba(0,0,0, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                    }
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };
    const animId = requestAnimationFrame(animate);

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animId);
    }
  }, [theme]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="block w-full h-full" />
        {/* Vignette & Scanline Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[1] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
    </div>
  );
};

export default NeuralInterface;