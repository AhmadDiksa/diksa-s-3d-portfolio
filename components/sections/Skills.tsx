'use client';

import { motion } from 'motion/react';

const categories = [
  {
    label: 'Languages',
    items: [
      { name: 'Go', color: '#00ADD8', icon: 'https://cdn.simpleicons.org/go/00ADD8' },
      { name: 'JavaScript', color: '#F7DF1E', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
      { name: 'Python', color: '#3776AB', icon: 'https://cdn.simpleicons.org/python/3776AB' },
      { name: 'PHP', color: '#777BB4', icon: 'https://cdn.simpleicons.org/php/777BB4' },
      { name: 'TypeScript', color: '#3178C6', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
      { name: 'Dart', color: '#0175C2', icon: 'https://cdn.simpleicons.org/dart/0175C2' },
    ],
  },
  {
    label: 'Frameworks',
    items: [
      { name: 'Next.js', color: '#ffffff', icon: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
      { name: 'React', color: '#61DAFB', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
      { name: 'Flutter', color: '#02569B', icon: 'https://cdn.simpleicons.org/flutter/02569B' },
      { name: 'Laravel', color: '#FF2D20', icon: 'https://cdn.simpleicons.org/laravel/FF2D20' },
      { name: 'PyTorch', color: '#EE4C2C', icon: 'https://cdn.simpleicons.org/pytorch/EE4C2C' },
      { name: 'TensorFlow', color: '#FF6F00', icon: 'https://cdn.simpleicons.org/tensorflow/FF6F00' },
      { name: 'LangChain', color: '#ffffff', icon: 'https://cdn.simpleicons.org/langchain/ffffff' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { name: 'Git', color: '#F05032', icon: 'https://cdn.simpleicons.org/git/F05032' },
      { name: 'Miro', color: '#FFD02F', icon: 'https://cdn.simpleicons.org/miro/FFD02F' },
      { name: 'Vercel', color: '#ffffff', icon: 'https://cdn.simpleicons.org/vercel/ffffff' },
      { name: 'Plane', color: '#ffffff', icon: 'https://cdn.simpleicons.org/plane/ffffff' },
    ],
  },
  {
    label: 'AI',
    items: [
      { name: 'Claude', color: '#D97757', icon: 'https://cdn.simpleicons.org/anthropic/D97757' },
      { name: 'Gemini', color: '#22d3ee', icon: 'https://cdn.simpleicons.org/googlegemini/22d3ee' },
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-32 relative z-10 w-full">
      <div className="container mx-auto px-6 max-w-screen-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-brand-400 font-mono">02.</span>
            <span className="text-[10px] uppercase tracking-widest opacity-50">Stack</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Skills &amp; Tools
          </h2>
          <div className="w-12 h-[1px] bg-white/20" />
        </motion.div>

        {/* Categories */}
        <div className="flex flex-col gap-16">
          {categories.map((cat, catIdx) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: catIdx * 0.1 }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 font-mono">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-4">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="group flex items-center gap-3 px-5 py-3 border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default"
                  >
                    {/* Logo */}
                    <div className="w-5 h-5 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.icon}
                        alt={item.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                        style={{ filter: 'brightness(1)' }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
