import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadState } from '@/lib/gameState';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, subMonths, addMonths } from 'date-fns';

export default function Dates() {
  const navigate = useNavigate();
  const [player] = useState(loadState);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const incompleteTodayQuests = player.quests.filter(q => !q.completed).length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="font-display text-xs text-muted-foreground tracking-widest mb-4 hover:text-primary transition-colors"
        >
          ← BACK TO BASE
        </button>

        <h1 className="font-display text-xl tracking-[0.3em] text-primary glow-text text-center mb-6">
          ◆ QUEST LOG
        </h1>

        {/* Today's status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="system-window mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-xs text-muted-foreground tracking-wider">TODAY</p>
              <p className="font-display text-lg text-primary">{format(today, 'EEEE, MMM d')}</p>
            </div>
            <div className="text-right">
              {incompleteTodayQuests > 0 ? (
                <p className="font-display text-xs text-glow-warning animate-pulse-glow">
                  ⚠ {incompleteTodayQuests} QUESTS PENDING
                </p>
              ) : (
                <p className="font-display text-xs text-glow-success">✓ ALL CLEAR</p>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate(`/dashboard?date=${todayStr}`)}
            className="w-full mt-3 py-2 font-display text-sm tracking-wider text-primary border border-primary/40 rounded hover:bg-primary/10 transition-colors"
          >
            OPEN TODAY'S QUESTS →
          </button>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="system-window"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="font-display text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1"
            >
              ◄
            </button>
            <h3 className="font-display text-sm tracking-widest text-primary">
              {format(currentMonth, 'MMMM yyyy').toUpperCase()}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="font-display text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1"
            >
              ►
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center font-display text-[10px] text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {[...Array(days[0].getDay())].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isTodayDay = isToday(day);
              const isFuture = day > today;

              return (
                <button
                  key={dayStr}
                  onClick={() => navigate(`/dashboard?date=${dayStr}`)}
                  disabled={isFuture}
                  className={`aspect-square rounded flex items-center justify-center font-display text-xs transition-all ${
                    isTodayDay
                      ? 'bg-primary/20 border border-primary/60 text-primary glow-border'
                      : isFuture
                      ? 'text-muted-foreground/30 cursor-not-allowed'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
