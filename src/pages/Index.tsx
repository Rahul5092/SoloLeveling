import { useState } from 'react';
import { loadState } from '@/lib/gameState';
import PlayerCard from '@/components/PlayerCard';
import StatsPanel from '@/components/StatsPanel';
import DailyQuests from '@/components/DailyQuests';
import HabitTracker from '@/components/HabitTracker';
import SpendingTracker from '@/components/SpendingTracker';
import BossPanel from '@/components/BossPanel';
import { motion } from 'framer-motion';

const Index = () => {
  const [player, setPlayer] = useState(loadState);

  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="font-display text-2xl md:text-3xl tracking-[0.3em] text-primary glow-text">
          SOLO LEVELING
        </h1>
        <p className="text-xs text-muted-foreground font-display tracking-widest mt-1">
          SYSTEM INTERFACE v1.0
        </p>
      </motion.div>

      {/* Grid Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-3 md:space-y-4">
          <PlayerCard player={player} />
          <StatsPanel player={player} setPlayer={setPlayer} />
          <BossPanel player={player} setPlayer={setPlayer} />
        </div>
        <div className="space-y-3 md:space-y-4">
          <DailyQuests player={player} setPlayer={setPlayer} />
          <HabitTracker player={player} setPlayer={setPlayer} />
          <SpendingTracker player={player} setPlayer={setPlayer} />
        </div>
      </div>
    </div>
  );
};

export default Index;
