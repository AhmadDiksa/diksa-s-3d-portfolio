'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { Skills } from '@/components/sections/Skills';

const BackgroundScene = dynamic(() => import('@/components/3d/BackgroundScene'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor').then(mod => mod.CustomCursor), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-brand-500/30 font-sans flex flex-col overflow-x-hidden relative">
      <BackgroundScene />
      
      {/* Background 3D Elements (Simulated) */}
      <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-500/20 to-cyan-400/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-150px] left-[-50px] w-[400px] h-[400px] rounded-full bg-brand-orange/10 blur-[100px] pointer-events-none z-0"></div>
      
      {/* Global Grid Overlay */}
      <div className="fixed inset-0 grid grid-cols-4 md:grid-cols-12 grid-rows-6 pointer-events-none opacity-[0.03] z-[1]">
        {[...Array(72)].map((_, i) => (
          <div key={i} className="border-r border-b border-white"></div>
        ))}
      </div>

      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <CustomCursor />
      
      {/* Content wrapper hidden until loading completes */}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'} relative z-10`}>
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
