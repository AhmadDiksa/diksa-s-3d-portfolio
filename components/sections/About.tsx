'use client';

import { motion } from 'motion/react';
import { useRef } from 'react';


export function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" className="py-32 relative z-10 w-full" ref={containerRef}>
      <div className="container mx-auto px-6 max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-brand-400 font-mono">01.</span>
            <span className="text-[10px] uppercase tracking-widest opacity-50">About</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">About Me</h2>
          <div className="w-12 h-[1px] bg-white/20" />
        </motion.div>

        <div className="grid grid-cols-1 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-white/70 leading-relaxed mb-6">
              I am a passionate Fullstack Developer who loves building end-to-end digital products — from robust backend systems to polished, interactive frontends. With experience across web, mobile, and AI, I craft solutions that are fast, scalable, and intuitive.
            </p>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              My stack spans Golang, TypeScript, Python, and Dart — paired with frameworks like Next.js, Flutter, and Laravel. I'm also deeply interested in AI engineering using PyTorch, TensorFlow, and LangChain.
            </p>
            
            <div className="glass-card p-6 border-brand-500/30">
              <h3 className="text-xl font-bold mb-2">My Philosophy</h3>
              <p className="text-white/60">"The best code is the one that solves real problems elegantly — from the database to the UI."</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
