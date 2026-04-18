'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Download, Mail } from 'lucide-react';

// SVG Components for GitHub and LinkedIn
const GithubIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

interface HeroSectionProps {
  t: {
    greeting: string;
    name: string;
    alias: string;
    roles: string[];
    cta_cv: string;
    cta_contact: string;
  };
}

export default function HeroSection({ t }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const PARTICLE_COUNT = 80;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const typeSequence = t.roles.reduce<(string | number)[]>((acc, role) => {
    acc.push(role, 2000);
    return acc;
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-blue-400 font-mono text-lg mb-3">{t.greeting}</p>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-2">
            {t.name}
          </h1>
          <p className="text-gray-500 font-mono text-xl mb-6">@{t.alias}</p>
          <div className="text-2xl sm:text-3xl font-medium text-gray-300 mb-10 h-10">
            <TypeAnimation
              sequence={typeSequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="/cv/ernesto-fierro-cv.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
            >
              <Download size={18} />
              {t.cta_cv}
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 border border-blue-500 text-blue-400 hover:bg-blue-500/10 font-semibold rounded-xl transition-all hover:scale-105"
            >
              <Mail size={18} />
              {t.cta_contact}
            </a>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/ErnestoFM"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="GitHub"
            >
              <GithubIcon size={22} />
            </a>
            <a
              href="https://linkedin.com/in/ernestofm"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={22} />
            </a>
            <a
              href="mailto:hello@ernestofm.dev"
              className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#about" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <span className="text-xs font-mono">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
