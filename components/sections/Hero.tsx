'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false });

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-visible max-w-screen-xl mx-auto"
    >
      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 md:px-24 text-center md:text-left flex flex-col justify-center h-full pt-20"
        style={{ y: y1, opacity }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
          <div className="flex flex-col items-center lg:items-start z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-brand-400">Available for hire</span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-[120px] font-black leading-[0.85] tracking-tighter uppercase mb-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Ahmad<br/>
              <span className="stroke-text">Diksa</span>
            </motion.h1>

            <motion.p
              className="mt-4 md:mt-8 max-w-sm text-sm text-white/60 leading-relaxed text-center lg:text-left"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Fullstack Developer & AI Engineer specialized in building end-to-end web, mobile, and intelligent AI-powered applications.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center gap-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a href="#projects" className="px-8 py-4 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-brand-500 hover:text-white transition-colors duration-300">
                View Work
              </a>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-12 h-[1px] bg-white/20"></div>
                <span className="text-[10px] tracking-widest uppercase opacity-40">Fullstack / AI Engineer</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="relative flex mt-12 lg:mt-0 items-center justify-center mx-auto lg:mx-0 overflow-visible"
            style={{ width: 500, height: 500 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
             <div className="absolute inset-0 overflow-visible" style={{ overflow: 'visible' }}>
                <HeroScene />
             </div>
             
             {/* Orbiting Micro-UI */}
             <motion.div 
               className="absolute -top-4 -right-4 bg-white/5 border border-white/10 p-4 backdrop-blur-md rounded-lg z-10"
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             >
               <div className="text-[14px] font-mono">Fullstack Dev</div>
             </motion.div>
             <motion.div 
               className="absolute bottom-10 -left-12 bg-white/5 border border-white/10 p-4 backdrop-blur-md rounded-lg z-10"
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             >
               <div className="text-[14px] font-mono">AI Engineer</div>
             </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
        <div className="[writing-mode:vertical-rl] text-[9px] uppercase tracking-[0.5em] opacity-30 rotate-180">SCROLL TO EXPLORE</div>
        <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
      </motion.div>
    </section>
  );
}
