'use client';

import { motion } from 'motion/react';

const socials = [
  { name: 'Github', href: 'https://github.com/AhmadDiksa' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmad-diksa-sumadiono/' },
  { name: 'Instagram', href: 'https://instagram.com/ahmad.diksa' },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 pt-20 pb-10 mt-10">
      <div className="container mx-auto px-6 max-w-screen-xl">

        {/* Big Name */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[clamp(3rem,10vw,9rem)] font-black uppercase tracking-tighter leading-none text-white/90 mb-16"
        >
          Ahmad Diksa
        </motion.h2>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">

          {/* Col 1 — Contact & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-mono">Email</p>
              <a
                href="mailto:dionjombang300@gmail.com"
                className="text-sm text-white hover:text-brand-400 transition-colors"
              >
                dionjombang300@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-mono">Location</p>
              <p className="text-sm text-white">Indonesia</p>
            </div>
          </motion.div>

          {/* Col 2 — Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4 font-mono">Social</p>
            <div className="flex flex-col divide-y divide-white/10">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-3 text-white hover:text-brand-400 transition-colors"
                >
                  <span className="text-base font-medium">{s.name}</span>
                  <span className="text-white/30 group-hover:text-brand-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Col 3 — Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-mono">About</p>
              <p className="text-sm text-white/60 leading-relaxed">
                Designed and developed by Ahmad Diksa Sumadiono — Fullstack Developer & AI Engineer based in Indonesia.
              </p>
            </div>
            <p className="text-[11px] font-mono text-white/20 mt-8">
              © {new Date().getFullYear()} AHMAD DIKSA
            </p>
          </motion.div>

        </div>
      </div>
    </footer>
  );
}
