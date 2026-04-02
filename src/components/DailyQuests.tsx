import { PlayerState, addXP, saveState, getCategoryIcon, getWorkoutPlanForDay, getWeekday } from '@/lib/gameState';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Props {
  player: PlayerState;
  setPlayer: (p: PlayerState) => void;
}

export default function DailyQuests({ player, setPlayer }: Props) {
  const [xpPopup, setXpPopup] = useState<{ id: string; amount: number } | null>(null);

  const completeQuest = (questId: string) => {
    const quest = player.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    const newQuests = player.quests.map(q =>
      q.id === questId ? { ...q, completed: true } : q
    );
    let newState = { ...player, quests: newQuests };
    newState = addXP(newState, quest.xpReward);

    // Damage boss
    if (newState.boss) {
      const damage = Math.floor(quest.xpReward * 0.8);
      newState.boss = {
        ...newState.boss,
        hpCurrent: Math.max(0, newState.boss.hpCurrent - damage),
      };
    }

    saveState(newState);
    setPlayer(newState);
    setXpPopup({ id: questId, amount: quest.xpReward });
    setTimeout(() => setXpPopup(null), 1000);
  };

  const completed = player.quests.filter(q => q.completed).length;
  const total = player.quests.length;
  const today = getWeekday();
  const todayWorkout = getWorkoutPlanForDay(today);

  const addTodayWorkoutToQuests = () => {
    const existingQuestIds = new Set(player.quests.map(q => q.id));
    const workoutQuests = todayWorkout
      .filter(q => !existingQuestIds.has(q.id))
      .map(q => ({ ...q, completed: false }));

    if (workoutQuests.length === 0) {
      return;
    }

    const updated = { ...player, quests: [...player.quests, ...workoutQuests] };
    saveState(updated);
    setPlayer(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="system-window"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm tracking-widest text-primary glow-text">
          ◆ DAILY QUESTS
        </h3>
        <span className="text-xs font-display text-muted-foreground">
          {completed}/{total}
        </span>
      </div>

      <div className="mb-2 p-2 rounded border border-secondary/40 bg-secondary/20">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-xs text-primary tracking-wider">TODAY’S WORKOUT ({today})</span>
          <button
            onClick={addTodayWorkoutToQuests}
            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-glow-warning"
          >
            + Add to quests
          </button>
        </div>
        <ul className="text-[11px] space-y-0.5 text-muted-foreground">
          {todayWorkout.map((item) => (
            <li key={item.id}>• {item.title}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {player.quests.map((quest) => (
          <div key={quest.id} className="relative">
            <button
              onClick={() => completeQuest(quest.id)}
              disabled={quest.completed}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition-all ${
                quest.completed
                  ? 'bg-secondary/50 text-muted-foreground line-through opacity-50'
                  : 'bg-secondary/80 hover:bg-secondary text-foreground hover:glow-border'
              }`}
            >
              <span className="text-base">{getCategoryIcon(quest.category)}</span>
              <span className="flex-1 font-body">{quest.title}</span>
              <span className="font-display text-xs text-primary">+{quest.xpReward}xp</span>
            </button>
            <AnimatePresence>
              {xpPopup?.id === quest.id && (
                <motion.span
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-2 top-0 font-display text-sm text-glow-warning"
                >
                  +{xpPopup.amount} XP!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
