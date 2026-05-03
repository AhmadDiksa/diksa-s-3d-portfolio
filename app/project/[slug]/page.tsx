'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Cpu, Globe, Tag } from 'lucide-react';
import { projects } from '@/data/portfolio-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-black mb-4 uppercase">Project Not Found</h1>
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-brand-500/30">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto px-6 max-w-screen-xl relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button 
            onClick={() => router.push('/#projects')}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to projects
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-brand-400">{project.index}</span>
                <span className="w-8 h-[1px] bg-white/20" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">{project.category}</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
                {project.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? 'stroke-text' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
            </div>
            
            <div className="flex gap-4">
              {project.links.live !== '#' && (
                <a 
                  href={project.links.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-400 hover:text-white transition-all"
                >
                  <Globe size={16} /> Live Demo
                </a>
              )}
              {project.links.github !== '#' && (
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all"
                >
                  <Github size={16} /> Source Code
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 mb-16 shadow-2xl"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Description */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-6 font-mono">Overview</h3>
            <div className="prose prose-invert max-w-none text-white/60 leading-loose">
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light italic mb-8">
                {project.fullDescription || project.description}
              </p>
              <p>
                This project represents a significant milestone in my development journey, combining performance-driven engineering with user-centric design principles. The primary focus was on creating a scalable architecture that could handle complex data flows while maintaining a seamless, high-performance interface.
              </p>
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-12"
          >
            {/* Tech Stack */}
            <div>
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 mb-6 font-mono">
                <Cpu size={14} className="text-brand-400" /> Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.split(' · ').map((tool) => (
                  <span 
                    key={tool} 
                    className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-full text-xs font-medium text-white/70 hover:border-white/30 hover:text-white transition-all cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Role & Date */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4 font-mono flex items-center gap-2">
                  <Tag size={12} className="text-brand-400" /> My Role
                </h3>
                <p className="text-sm font-medium text-white/90">{project.role || 'Lead Developer'}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4 font-mono flex items-center gap-2">
                   Date
                </h3>
                <p className="text-sm font-medium text-white/90">{project.date || '2024'}</p>
              </div>
            </div>

            {/* Next Project Hint */}
            <div className="pt-12 border-t border-white/10">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4">Ready for more?</p>
              <Link 
                href="/#projects"
                className="group flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-xl hover:border-brand-400/30 transition-all duration-500"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Explore All Projects</span>
                <ArrowLeft className="rotate-180 text-white/20 group-hover:text-brand-400 group-hover:translate-x-2 transition-all" size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[150px] rounded-full" />
      </div>
    </main>
  );
}
