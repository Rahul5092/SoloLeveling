import { PlayerState, addXP, saveState, generateBoss } from '@/lib/gameState';
import { motion } from 'framer-motion';

interface Props {
  player: PlayerState;
  setPlayer: (p: PlayerState) => void;
}

export default function BossPanel({ player, setPlayer }: Props) {
  const boss = player.boss;
  if (!boss) return null;

  const hpPercent = (boss.hpCurrent / boss.hpMax) * 100;
  const defeated = boss.hpCurrent <= 0;

  const claimReward = () => {
    let newState = addXP(player, boss.xpReward);
    newState.boss = generateBoss(newState.level);
    saveState(newState);
    setPlayer(newState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`system-window ${defeated ? 'glow-accent' : ''}`}
    >
      <h3 className="font-display text-sm tracking-widest text-accent mb-2" style={{ textShadow: '0 0 10px hsl(260 80% 60% / 0.6)' }}>
        ◆ BOSS RAID
      </h3>
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-foreground text-sm">{boss.name}</span>
        <span className="text-xs text-muted-foreground font-display">
          Reward: {boss.xpReward} XP
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2 font-body">{boss.description}</p>

      {/* HP Bar */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-xs font-display text-muted-foreground">
          <span>HP</span>
          <span>{boss.hpCurrent}/{boss.hpMax}</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: defeated
                ? 'hsl(145 70% 45%)'
                : `linear-gradient(90deg, hsl(0 80% 40%), hsl(0 80% 60%))`,
              boxShadow: defeated
                ? '0 0 10px hsl(145 70% 45% / 0.5)'
                : '0 0 10px hsl(0 80% 55% / 0.5)',
            }}
            animate={{ width: `${hpPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {defeated && (
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={claimReward}
          className="w-full py-2 rounded font-display text-sm tracking-wider bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30 transition-colors"
        >
          ✦ CLAIM REWARD ✦
        </motion.button>
      )}

      <p className="text-xs text-muted-foreground mt-1 font-display text-center">
        Complete quests to damage the boss!
      </p>
    </motion.div>
  );
}
