import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  color: string;
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

const COLORS = [
  "20, 184, 166",   // teal
  "56, 189, 248",   // sky
  "20, 184, 166",   // teal (more weight)
  "20, 184, 166",
  "99, 102, 241",   // indigo
];

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const packets: DataPacket[] = [];
    const PARTICLE_COUNT = 75;
    const CONNECTION_DIST = 140;
    const MAX_PACKETS = 8;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.45 + 0.12,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.018 + 0.008,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const spawnPacket = () => {
      if (packets.length >= MAX_PACKETS) return;
      const fromIdx = Math.floor(Math.random() * particles.length);
      // Find a neighbor
      let toIdx = -1;
      let minDist = Infinity;
      for (let i = 0; i < particles.length; i++) {
        if (i === fromIdx) continue;
        const dx = particles[fromIdx].x - particles[i].x;
        const dy = particles[fromIdx].y - particles[i].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST && d < minDist) {
          minDist = d;
          toIdx = i;
        }
      }
      if (toIdx !== -1) {
        packets.push({ fromIdx, toIdx, progress: 0, speed: 0.012 + Math.random() * 0.01 });
      }
    };

    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Spawn data packets occasionally
      if (frameCount % 90 === 0) spawnPacket();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // Draw data packets (glowing dots traveling along connections)
      for (let i = packets.length - 1; i >= 0; i--) {
        const pkt = packets[i];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const from = particles[pkt.fromIdx];
        const to = particles[pkt.toIdx];
        const x = from.x + (to.x - from.x) * pkt.progress;
        const y = from.y + (to.y - from.y) * pkt.progress;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 4);
        grad.addColorStop(0, "rgba(20, 184, 166, 0.9)");
        grad.addColorStop(1, "rgba(20, 184, 166, 0)");
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw particles
      for (const p of particles) {
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, `rgba(${p.color}, ${currentOpacity})`);
        glow.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.min(currentOpacity * 2, 0.9)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.65 }}
    />
  );
}
