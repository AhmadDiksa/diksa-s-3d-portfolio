'use client';

import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { experiences } from '@/data/portfolio-data';

export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll through the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  });

  // Spring for smooth line growth
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section id="experience" className="py-32 relative z-10" ref={sectionRef}>
      <div className="container mx-auto px-6 max-w-screen-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
            My career &amp;
          </h2>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-brand-400">
            experience
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line track (background) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10"
            style={{ zIndex: 0 }}
          />

          {/* Animated growing line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] origin-top"
            style={{
              scaleY,
              height: '100%',
              background: 'linear-gradient(to bottom, #22d3ee, #3b82f6)',
              zIndex: 1,
            }}
          />

          {/* Entries */}
          <div className="flex flex-col">
            {experiences.map((exp, i) => (
              <ExperienceRow key={i} exp={exp} index={i} scrollYProgress={scrollYProgress} total={experiences.length} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function ExperienceRow({
  exp,
  index,
  scrollYProgress,
  total,
}: {
  exp: typeof experiences[0];
  index: number;
  scrollYProgress: any;
  total: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rowScroll } = useScroll({
    target: rowRef,
    offset: ['start 85%', 'start 40%'],
  });

  const opacity = useTransform(rowScroll, [0, 1], [0, 1]);
  const leftX = useTransform(rowScroll, [0, 1], [-30, 0]);
  const rightX = useTransform(rowScroll, [0, 1], [30, 0]);

  // Glowing dot progress (dot appears when this row's scroll hits)
  const dotScale = useTransform(rowScroll, [0, 0.5, 1], [0, 1.5, 1]);
  const dotOpacity = useTransform(rowScroll, [0, 0.4, 1], [0, 1, 1]);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-3 gap-8 py-14 relative"
      style={{ minHeight: 160 }}
    >
      {/* LEFT — Role + Company */}
      <motion.div
        style={{ opacity, x: leftX }}
        className="flex flex-col justify-center items-end text-right pr-8"
      >
        <h3 className="text-xl md:text-2xl font-bold text-white/90 leading-tight mb-2">
          {exp.role}
        </h3>
        <span className="text-sm text-brand-400 font-mono">{exp.company}</span>
      </motion.div>

      {/* CENTER — Year + dot */}
      <div className="flex flex-col items-center justify-center relative z-10">
        {/* Glowing dot on the line */}
        <motion.div
          style={{ scale: dotScale, opacity: dotOpacity }}
          className="relative z-10 mb-3"
        >
          <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_6px_rgba(34,211,238,0.6)]" />
        </motion.div>

        {/* Big year */}
        <motion.span
          style={{ opacity }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-white/80"
        >
          {exp.year}
        </motion.span>
      </div>

      {/* RIGHT — Description */}
      <motion.div
        style={{ opacity, x: rightX }}
        className="flex flex-col justify-center pl-8"
      >
        <p className="text-sm text-white/50 leading-relaxed">
          {exp.description}
        </p>
      </motion.div>
    </div>
  );
}
