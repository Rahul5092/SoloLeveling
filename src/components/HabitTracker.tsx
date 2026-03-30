import { PlayerState, addXP, saveState, getCategoryIcon } from '@/lib/gameState';
import { motion } from 'framer-motion';

interface Props {
  player: PlayerState;
  setPlayer: (p: PlayerState) => void;
}

export default function HabitTracker({ player, setPlayer }: Props) {
  const completeHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newHabits = player.habits.map(h => {
      if (h.id !== habitId || h.completedToday) return h;
      return {
        ...h,
        completedToday: true,
        lastCompleted: today,
        streak: h.streak + 1,
      };
    });
    const habit = player.habits.find(h => h.id === habitId);
    let newState = { ...player, habits: newHabits };
    if (habit && !habit.completedToday) {
      const streakBonus = Math.min((habit.streak + 1) * 2, 20);
      newState = addXP(newState, 15 + streakBonus);
    }
    saveState(newState);
    setPlayer(newState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="system-window"
    >
      <h3 className="font-display text-sm tracking-widest text-primary mb-3 glow-text">
        ◆ HABIT STREAKS
      </h3>
      <div className="space-y-2">
        {player.habits.map(habit => (
          <button
            key={habit.id}
            onClick={() => completeHabit(habit.id)}
            disabled={habit.completedToday}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-all ${
              habit.completedToday
                ? 'bg-glow-success/10 border border-glow-success/30 text-glow-success'
                : 'bg-secondary/80 hover:bg-secondary text-foreground hover:glow-border'
            }`}
          >
            <span>{getCategoryIcon(habit.category)}</span>
            <span className="flex-1 text-left font-body">{habit.name}</span>
            <span className="font-display text-xs">
              {habit.completedToday ? '✓' : ''} 🔥{habit.streak}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
