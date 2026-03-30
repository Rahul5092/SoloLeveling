import { PlayerState } from '@/lib/gameState';
import { motion } from 'framer-motion';

interface Props {
  player: PlayerState;
}

export default function PlayerCard({ player }: Props) {
  const xpPercent = (player.xp / player.xpToNext) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="system-window"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display text-xl tracking-wider text-primary glow-text">
            {player.name}
          </h2>
          <p className="text-sm text-muted-foreground font-display tracking-wide">
            {player.title}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold text-primary glow-text">
            Lv.{player.level}
          </div>
          <div className="text-xs text-muted-foreground">
            🔥 {player.dayStreak} day streak
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-display text-muted-foreground">
          <span>EXP</span>
          <span>{player.xp} / {player.xpToNext}</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, hsl(195 100% 40%), hsl(195 100% 60%))',
              boxShadow: '0 0 10px hsl(195 100% 50% / 0.5)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {player.statPoints > 0 && (
        <div className="mt-2 text-center">
          <span className="text-xs font-display text-glow-warning animate-pulse-glow">
            ✦ {player.statPoints} stat points available ✦
          </span>
        </div>
      )}
    </motion.div>
  );
}
