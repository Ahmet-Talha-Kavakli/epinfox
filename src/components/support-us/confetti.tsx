"use client";

import { useEffect, useRef } from "react";

/* Hafif konfeti — kütüphanesiz, tek canvas. mount olduğunda patlar,
   parçalar yere düşüp solunca durur. */

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  size: number;
  color: string;
  life: number;
}

const COLORS = ["#ef4444", "#fb7185", "#f97316", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"];

export function Confetti({ fire }: { fire: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = (canvas.width = window.innerWidth * dpr);
    const H = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    // Ekranın ORTASINDAN her yöne radyal patlama
    const pieces: Piece[] = [];
    const cx = W / 2;
    const cy = H * 0.42; // hafif yukarı (pop-up üstü hizası)
    const N = 340;
    for (let i = 0; i < N; i++) {
      // 360° eşit dağılım + hafif rastgelelik (index tabanlı, deterministik)
      const angle = (i / N) * Math.PI * 2 + (i % 5) * 0.08;
      const speed = (7 + (i % 11)) * dpr; // farklı hızlar → dolgun patlama
      pieces.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3 * dpr, // hafif yukarı eğilim
        rot: (i / N) * Math.PI * 2,
        vrot: (i % 2 ? 1 : -1) * 0.25,
        size: (6 + (i % 7)) * dpr,
        color: COLORS[i % COLORS.length],
        life: 1,
      });
    }

    const gravity = 0.2 * dpr;
    let frame = 0;
    const maxFrames = 380;

    function tick() {
      frame++;
      ctx!.clearRect(0, 0, W, H);
      for (const p of pieces) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (frame > maxFrames - 90) p.life -= 1 / 90;
        if (p.life <= 0) continue;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.globalAlpha = Math.max(0, p.life);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx!.restore();
      }
      if (frame < maxFrames) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx!.clearRect(0, 0, W, H);
      }
    }
    tick();

    return () => cancelAnimationFrame(rafRef.current);
  }, [fire]);

  if (!fire) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[200]"
      aria-hidden
    />
  );
}
