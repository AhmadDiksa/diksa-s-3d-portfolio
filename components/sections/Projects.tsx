'use client';

import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/portfolio-data';


// Duplicate for seamless loop
const items = [...projects, ...projects];

const CARD_WIDTH = 360;
const CARD_GAP = 24;
const TOTAL_WIDTH = projects.length * (CARD_WIDTH + CARD_GAP);
const SPEED = 0.5; // px per frame

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <Link
      href={`/project/${project.slug}`}
      draggable="false"
      className="relative flex-shrink-0 group cursor-pointer border border-white/10 hover:border-white/25 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05] select-none"
      style={{ width: CARD_WIDTH }}
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden pointer-events-none">
        <Image
          src={project.image}
          alt={project.title}
          fill
          draggable={false}
          className="object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
        {/* Category badge */}
        <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-black/60 backdrop-blur-sm px-2 py-1 text-white/60 border border-white/10">
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-mono text-white/30 tracking-widest mb-1">{project.index}</p>
            <h3 className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-white/90 transition-colors">
              {project.title}
            </h3>
          </div>
          <motion.div
            className="w-7 h-7 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:border-white transition-all duration-300"
            whileHover={{ rotate: 45 }}
          >
            <ArrowUpRight size={12} className="group-hover:text-black transition-colors" />
          </motion.div>
        </div>

        <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="pt-3 border-t border-white/10">
          <p className="text-[9px] font-mono text-white/30 tracking-wider">{project.tools}</p>
        </div>
      </div>
    </Link>
  );
}

function InfiniteCarousel() {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const isDragging = useRef(false);

  useAnimationFrame(() => {
    if (isPaused.current || isDragging.current) return;
    const current = x.get();
    const next = current - SPEED;
    // Reset when first set scrolled fully out
    if (next <= -TOTAL_WIDTH) {
      x.set(0);
    } else {
      x.set(next);
    }
  });

  // Handle manual drag wrap-around
  const handleDrag = () => {
    const currentX = x.get();
    if (currentX > 0) {
      x.set(currentX - TOTAL_WIDTH);
    } else if (currentX < -TOTAL_WIDTH) {
      x.set(currentX + TOTAL_WIDTH);
    }
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <motion.div
        className="flex"
        style={{ x, gap: CARD_GAP }}
        drag="x"
        dragConstraints={{ left: -TOTAL_WIDTH * 2, right: TOTAL_WIDTH }}
        onDragStart={() => { 
          isDragging.current = true;
          isPaused.current = true;
        }}
        onDrag={(e, info) => {
          handleDrag();
        }}
        onDragEnd={(e, info) => {
          isDragging.current = false;
          // Resume auto-scroll after a short delay
          setTimeout(() => {
            if (!isPaused.current) isPaused.current = false;
          }, 1000);
          handleDrag();
        }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        dragElastic={0.05}
      >
        {items.map((project, i) => (
          <ProjectCard key={`${project.index}-${i}`} project={project} />
        ))}
      </motion.div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-6 max-w-screen-xl mb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-brand-400 font-mono">03.</span>
            <span className="text-[10px] uppercase tracking-widest opacity-50">Work</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            My <span className="stroke-text">Work</span>
          </h2>
          <div className="w-12 h-[1px] bg-white/20" />
        </motion.div>
      </div>

      {/* Contained carousel with fade edges */}
      <div className="container mx-auto px-6 max-w-screen-xl">
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-48 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #050505 0%, transparent 100%)' }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-48 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #050505 0%, transparent 100%)' }} />
          <InfiniteCarousel />
        </div>
      </div>
    </section>
  );
}
