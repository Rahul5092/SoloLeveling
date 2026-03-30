import { PlayerState, saveState } from '@/lib/gameState';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  player: PlayerState;
  setPlayer: (p: PlayerState) => void;
}

export default function SpendingTracker({ player, setPlayer }: Props) {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const addSpending = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    const entry = {
      id: `s-${Date.now()}`,
      amount: val,
      description: desc || 'Expense',
      date: new Date().toISOString().split('T')[0],
    };
    const newState = {
      ...player,
      spending: [entry, ...player.spending].slice(0, 50),
      totalSpent: player.totalSpent + val,
    };
    saveState(newState);
    setPlayer(newState);
    setAmount('');
    setDesc('');
  };

  const todaySpent = player.spending
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="system-window"
    >
      <h3 className="font-display text-sm tracking-widest text-primary mb-3 glow-text">
        ◆ GOLD TRACKER
      </h3>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-secondary/60 rounded p-2 text-center">
          <p className="text-xs text-muted-foreground font-display">Today</p>
          <p className="font-display text-lg text-glow-warning">₹{todaySpent.toFixed(0)}</p>
        </div>
        <div className="bg-secondary/60 rounded p-2 text-center">
          <p className="text-xs text-muted-foreground font-display">Total</p>
          <p className="font-display text-lg text-glow-danger">₹{player.totalSpent.toFixed(0)}</p>
        </div>
      </div>

      <div className="flex gap-1.5 mb-2">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          className="flex-1 bg-secondary/80 border border-border rounded px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="What for?"
          className="flex-1 bg-secondary/80 border border-border rounded px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary"
        />
        <button
          onClick={addSpending}
          className="px-3 py-1.5 bg-primary/20 border border-primary/40 rounded font-display text-xs text-primary hover:bg-primary/30 transition-colors"
        >
          ADD
        </button>
      </div>

      <div className="space-y-1 max-h-24 overflow-y-auto">
        {player.spending.slice(0, 5).map(s => (
          <div key={s.id} className="flex justify-between text-xs text-muted-foreground px-1">
            <span className="font-body">{s.description}</span>
            <span className="font-display text-glow-warning">₹{s.amount}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
