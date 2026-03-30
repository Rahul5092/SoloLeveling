import { Stats, PlayerState, saveState } from '@/lib/gameState';
import { motion } from 'framer-motion';

interface Props {
  player: PlayerState;
  setPlayer: (p: PlayerState) => void;
}

const STAT_CONFIG: { key: keyof Stats; label: string; color: string }[] = [
  { key: 'str', label: 'STR', color: 'bg-stat-str' },
  { key: 'int', label: 'INT', color: 'bg-stat-int' },
  { key: 'agi', label: 'AGI', color: 'bg-stat-agi' },
  { key: 'vit', label: 'VIT', color: 'bg-stat-vit' },
  { key: 'wis', label: 'WIS', color: 'bg-stat-wis' },
];

export default function StatsPanel({ player, setPlayer }: Props) {
  const allocate = (stat: keyof Stats) => {
    if (player.statPoints <= 0) return;
    const newState = {
      ...player,
      stats: { ...player.stats, [stat]: player.stats[stat] + 1 },
      statPoints: player.statPoints - 1,
    };
    saveState(newState);
    setPlayer(newState);
  };

  const maxStat = Math.max(...Object.values(player.stats), 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="system-window"
    >
      <h3 className="font-display text-sm tracking-widest text-primary mb-3 glow-text">
        ◆ STATUS WINDOW
      </h3>
      <div className="space-y-2">
        {STAT_CONFIG.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-display text-xs w-8 text-muted-foreground">{label}</span>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(player.stats[key] / maxStat) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{ opacity: 0.8 }}
              />
            </div>
            <span className="font-display text-xs w-6 text-right text-foreground">
              {player.stats[key]}
            </span>
            {player.statPoints > 0 && (
              <button
                onClick={() => allocate(key)}
                className="text-xs text-primary hover:text-primary/80 font-display glow-text transition-colors"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
