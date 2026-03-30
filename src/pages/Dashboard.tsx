import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadState, saveState, Quest, PlayerState } from '@/lib/gameState';
import PlayerCard from '@/components/PlayerCard';
import StatsPanel from '@/components/StatsPanel';
import DailyQuests from '@/components/DailyQuests';
import HabitTracker from '@/components/HabitTracker';
import SpendingTracker from '@/components/SpendingTracker';
import BossPanel from '@/components/BossPanel';
import AddQuestDialog from '@/components/AddQuestDialog';
import LevelUpOverlay from '@/components/LevelUpOverlay';
import { startQuestReminder, stopQuestReminder, sendNotification } from '@/lib/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function Dashboard() {
  const [player, setPlayer] = useState(loadState);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const prevLevelRef = useRef(player.level);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSetPlayer = useCallback((newPlayer: PlayerState) => {
    if (newPlayer.level > prevLevelRef.current) {
      setLevelUpLevel(newPlayer.level);
    }
    prevLevelRef.current = newPlayer.level;
    setPlayer(newPlayer);
  }, []);

  const dateParam = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isToday = dateParam === todayStr;

  // Start notification reminders
  useEffect(() => {
    if (isToday) {
      startQuestReminder(() => ({
        incomplete: player.quests.filter(q => !q.completed).length,
      }));
    }
    return () => stopQuestReminder();
  }, [isToday]);

  // Notify on first load if quests pending
  useEffect(() => {
    if (isToday) {
      const incomplete = player.quests.filter(q => !q.completed).length;
      if (incomplete > 0) {
        sendNotification('🎮 Welcome back, Rahul!', `${incomplete} daily quests await you!`);
      }
    }
  }, []);

  const addQuest = (quest: Quest) => {
    const newState = { ...player, quests: [...player.quests, quest] };
    saveState(newState);
    handleSetPlayer(newState);
  };

  const addTomorrowQuest = (quest: Quest) => {
    // Store tomorrow's quests separately in localStorage
    const tomorrowKey = 'solo-leveling-tomorrow-quests';
    const existing = JSON.parse(localStorage.getItem(tomorrowKey) || '[]');
    existing.push(quest);
    localStorage.setItem(tomorrowKey, JSON.stringify(existing));
  };

  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      {/* Level Up Overlay */}
      <AnimatePresence>
        {levelUpLevel !== null && (
          <LevelUpOverlay level={levelUpLevel} onDismiss={() => setLevelUpLevel(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-2">
          <button
            onClick={() => navigate('/dates')}
            className="font-display text-xs text-muted-foreground tracking-widest hover:text-primary transition-colors"
          >
            ← QUEST LOG
          </button>
          <span className="font-display text-xs text-muted-foreground tracking-wider">
            {isToday ? 'TODAY' : format(new Date(dateParam + 'T00:00:00'), 'MMM d, yyyy').toUpperCase()}
          </span>
          <button
            onClick={() => navigate('/')}
            className="font-display text-xs text-muted-foreground tracking-widest hover:text-primary transition-colors"
          >
            HOME
          </button>
        </div>

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
          <StatsPanel player={player} setPlayer={handleSetPlayer} />
          <BossPanel player={player} setPlayer={handleSetPlayer} />
        </div>
        <div className="space-y-3 md:space-y-4">
          {/* Daily Quests with Add buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                {isToday && <AddQuestDialog onAdd={addQuest} />}
                <AddQuestDialog onAdd={addTomorrowQuest} forTomorrow />
              </div>
            </div>
            <DailyQuests player={player} setPlayer={handleSetPlayer} />
          </motion.div>
          <HabitTracker player={player} setPlayer={handleSetPlayer} />
          <SpendingTracker player={player} setPlayer={handleSetPlayer} />
        </div>
      </div>
    </div>
  );
}
