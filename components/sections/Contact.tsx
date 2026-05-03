'use client';

import { motion } from 'motion/react';
import { Mail, Linkedin, Github, Instagram, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export function Contact() {
  return (
    <section id="contact" className="py-32 relative z-10 w-full min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-10 md:p-20 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-6 justify-center">
            <span className="text-[10px] text-brand-400 font-mono">04.</span>
            <span className="text-[10px] uppercase tracking-widest opacity-50">Reach Out</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Let's build something <br/> <span className="stroke-text">extraordinary.</span></h2>
          <p className="text-sm text-white/60 mb-12 max-w-lg mx-auto leading-relaxed">
            I'm currently available for freelance work and open to new opportunities. If you have a project in mind, let's talk.
          </p>

          <a 
            href="mailto:dionjombang300@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-brand-500 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <Mail size={16} /> Say Hello
          </a>

          <Link
            href="/game"
            className="inline-flex items-center gap-2 ml-4 px-8 py-4 border border-white/20 text-white text-[11px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            <Gamepad2 size={16} /> Play a Game
          </Link>

          <div className="flex justify-center gap-6 mt-16">
            <SocialLink href="https://github.com/AhmadDiksa" icon={<Github size={18} />} label="GitHub" />
            <SocialLink href="https://www.linkedin.com/in/ahmad-diksa-sumadiono/" icon={<Linkedin size={18} />} label="LinkedIn" />
            <SocialLink href="https://instagram.com/ahmad.diksa" icon={<Instagram size={18} />} label="Instagram" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      className="p-3 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-brand-400 hover:border-brand-400 transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

