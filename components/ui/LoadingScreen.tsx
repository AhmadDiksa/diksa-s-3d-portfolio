'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { progress: loadProgress, active } = useProgress();
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Smooth out the progress display
  useEffect(() => {
    if (loadProgress > progress) {
      setProgress(loadProgress);
    }
  }, [loadProgress, progress]);

  // Ensure loading screen stays for at least 1.5s for brand presence and smooth transition
  useEffect(() => {
    const minTime = setTimeout(() => {
      setIsDone(true);
    }, 1500);
    return () => clearTimeout(minTime);
  }, []);

  useEffect(() => {
    // Only complete if minimum time has passed AND three.js is done loading
    if (isDone && !active && progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isDone, active, progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center overflow-hidden"
      exit={{ 
        y: '-100%',
        opacity: 0.8
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.7, 0, 0.3, 1], // Custom cinematic ease
      }}
    >
      {/* Background shards/elements for depth during transition */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-10"
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:40px_40px]" />
      </motion.div>
      <div className="relative w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute top-0 left-0 h-full bg-brand-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
      </div>
      <div className="text-white font-space text-4xl font-bold font-mono tracking-widest">
        {Math.min(progress, 100)}%
      </div>
      <motion.div 
        className="mt-4 text-white/50 text-sm font-space tracking-[0.2em] uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Loading Experience
      </motion.div>
    </motion.div>
  );
}
