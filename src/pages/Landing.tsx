import { loadState, getRankTitle } from '@/lib/gameState';
import { requestNotificationPermission } from '@/lib/notifications';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Landing() {
  const [player] = useState(loadState);
  const navigate = useNavigate();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const rankColor = () => {
    if (player.level >= 50) return 'text-glow-warning';
    if (player.level >= 40) return 'text-glow-danger';
    if (player.level >= 30) return 'text-accent';
    if (player.level >= 20) return 'text-glow-success';
    if (player.level >= 10) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -60],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Title */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-3xl md:text-5xl tracking-[0.3em] text-primary glow-text mb-2"
        >
          SOLO LEVELING
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display text-xs tracking-[0.5em] text-muted-foreground mb-10"
        >
          SYSTEM INTERFACE
        </motion.p>

        {/* Player Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="system-window max-w-sm mx-auto mb-8"
        >
          <div className="text-center space-y-3">
            <p className="font-display text-xs tracking-widest text-muted-foreground">PLAYER</p>
            <h2 className="font-display text-2xl tracking-wider text-primary glow-text">
              RAHUL
            </h2>

            <div className="h-px bg-border/50 my-2" />

            <div className="space-y-2">
              <p className="font-display text-xs tracking-widest text-muted-foreground">RANK</p>
              <p className={`font-display text-lg tracking-wider ${rankColor()}`} style={{ textShadow: '0 0 15px currentColor' }}>
                {player.title.toUpperCase()}
              </p>
            </div>

            <div className="h-px bg-border/50 my-2" />

            <div className="flex justify-between px-4">
              <div className="text-center">
                <p className="font-display text-2xl text-primary glow-text">{player.level}</p>
                <p className="font-display text-[10px] text-muted-foreground tracking-wider">LEVEL</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl text-glow-warning">{player.dayStreak}</p>
                <p className="font-display text-[10px] text-muted-foreground tracking-wider">STREAK</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl text-accent">
                  {player.quests.filter(q => q.completed).length}/{player.quests.length}
                </p>
                <p className="font-display text-[10px] text-muted-foreground tracking-wider">QUESTS</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dates')}
          className="px-10 py-3 font-display text-sm tracking-[0.3em] text-primary border border-primary/50 rounded-lg glow-border hover:bg-primary/10 transition-all"
        >
          ENTER SYSTEM
        </motion.button>
      </motion.div>
    </div>
  );
}
