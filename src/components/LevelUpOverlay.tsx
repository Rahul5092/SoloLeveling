import { motion, AnimatePresence } from 'framer-motion';
import { getRankTitle } from '@/lib/gameState';
import { useEffect, useState } from 'react';

interface Props {
  level: number;
  onDismiss: () => void;
}

export default function LevelUpOverlay({ level, onDismiss }: Props) {
  const [phase, setPhase] = useState(0);
  const title = getRankTitle(level);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(onDismiss, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onDismiss}
    >
      {/* Dark overlay with radial glow */}
      <motion.div
        className="absolute inset-0 bg-background/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Expanding ring effect */}
      <AnimatePresence>
        {phase >= 0 && (
          <motion.div
            className="absolute rounded-full border-2 border-primary/60"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 800, height: 800, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            className="absolute rounded-full border border-accent/40"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 1200, height: 1200, opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Particle burst */}
      {phase >= 1 && [...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 150 + Math.random() * 100;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary"
            style={{ boxShadow: '0 0 8px hsl(var(--glow-primary))' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        );
      })}

      {/* Central content */}
      <div className="relative z-10 text-center">
        {/* System tag */}
        <AnimatePresence>
          {phase >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            >
              <span className="font-display text-xs tracking-[0.5em] text-muted-foreground">
                — SYSTEM NOTIFICATION —
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEVEL UP text */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 150, damping: 12 }}
              className="font-display text-5xl md:text-7xl tracking-[0.2em] text-primary mt-4 mb-2"
              style={{
                textShadow: '0 0 30px hsl(195 100% 50% / 0.8), 0 0 60px hsl(195 100% 50% / 0.4), 0 0 100px hsl(195 100% 50% / 0.2)',
              }}
            >
              LEVEL UP
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Level number */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <p className="font-display text-8xl md:text-9xl font-bold text-primary/90 my-4"
                style={{
                  textShadow: '0 0 40px hsl(195 100% 50% / 0.6), 0 0 80px hsl(195 100% 50% / 0.3)',
                }}
              >
                {level}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rank title */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <p className="font-display text-lg tracking-[0.3em] text-accent"
                style={{ textShadow: '0 0 15px hsl(260 80% 60% / 0.6)' }}
              >
                {title.toUpperCase()}
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <p className="font-display text-2xl text-glow-warning">+3</p>
                  <p className="font-display text-[9px] tracking-wider text-muted-foreground">STAT POINTS</p>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-display text-[10px] tracking-[0.4em] text-muted-foreground mt-6"
              >
                TAP TO CONTINUE
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
