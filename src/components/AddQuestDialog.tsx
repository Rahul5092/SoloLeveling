import { useState } from 'react';
import { Quest } from '@/lib/gameState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface Props {
  onAdd: (quest: Quest) => void;
  forTomorrow?: boolean;
}

const CATEGORIES: { value: Quest['category']; label: string; icon: string }[] = [
  { value: 'fitness', label: 'Fitness', icon: '⚔️' },
  { value: 'learning', label: 'Learning', icon: '📖' },
  { value: 'productivity', label: 'Productivity', icon: '⚡' },
  { value: 'wellness', label: 'Wellness', icon: '🧘' },
  { value: 'diet', label: 'Diet', icon: '🍎' },
];

export default function AddQuestDialog({ onAdd, forTomorrow }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Quest['category']>('productivity');
  const [xp, setXp] = useState('25');

  const handleAdd = () => {
    if (!title.trim()) return;
    const quest: Quest = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      xpReward: Math.max(5, Math.min(100, parseInt(xp) || 25)),
      completed: false,
    };
    onAdd(quest);
    setTitle('');
    setXp('25');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 font-display text-xs tracking-wider text-primary border border-primary/40 rounded hover:bg-primary/10 transition-all"
        >
          + {forTomorrow ? 'ADD FOR TOMORROW' : 'ADD QUEST'}
        </motion.button>
      </DialogTrigger>
      <DialogContent className="system-window border-primary/30 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-sm tracking-widest text-primary glow-text">
            ◆ NEW {forTomorrow ? 'TOMORROW\'S' : ''} QUEST
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="font-display text-[10px] tracking-wider text-muted-foreground block mb-1">
              QUEST NAME
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-secondary/80 border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="font-display text-[10px] tracking-wider text-muted-foreground block mb-1">
              CATEGORY
            </label>
            <div className="grid grid-cols-5 gap-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded text-xs transition-all ${
                    category === cat.value
                      ? 'bg-primary/20 border border-primary/50 text-primary'
                      : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="font-display text-[8px] tracking-wider">{cat.label.slice(0, 4).toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-display text-[10px] tracking-wider text-muted-foreground block mb-1">
              XP REWARD
            </label>
            <input
              type="number"
              value={xp}
              onChange={e => setXp(e.target.value)}
              min={5}
              max={100}
              className="w-20 bg-secondary/80 border border-border rounded px-3 py-2 text-sm text-foreground font-display focus:outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="w-full py-2.5 font-display text-sm tracking-wider text-primary-foreground bg-primary/80 hover:bg-primary rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ACCEPT QUEST
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
