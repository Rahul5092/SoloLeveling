export interface Quest {
  id: string;
  title: string;
  category: 'fitness' | 'learning' | 'productivity' | 'wellness' | 'diet';
  xpReward: number;
  completed: boolean;
  description?: string;
}

export interface Stats {
  str: number;
  int: number;
  agi: number;
  vit: number;
  wis: number;
}

export interface HabitEntry {
  id: string;
  name: string;
  category: string;
  streak: number;
  lastCompleted: string | null;
  completedToday: boolean;
}

export interface SpendingEntry {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface BossChallenge {
  id: string;
  name: string;
  description: string;
  hpMax: number;
  hpCurrent: number;
  xpReward: number;
  deadline: string;
  tasks: { id: string; text: string; done: boolean }[];
}

export interface PlayerState {
  name: string;
  title: string;
  level: number;
  xp: number;
  xpToNext: number;
  stats: Stats;
  statPoints: number;
  quests: Quest[];
  habits: HabitEntry[];
  spending: SpendingEntry[];
  totalSpent: number;
  boss: BossChallenge | null;
  lastLoginDate: string;
  dayStreak: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  fitness: '⚔️',
  learning: '📖',
  productivity: '⚡',
  wellness: '🧘',
  diet: '🍎',
};

export const getCategoryIcon = (cat: string) => CATEGORY_ICONS[cat] || '📋';
export const getCategoryLabel = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1);

const DEFAULT_QUESTS: Quest[] = [
  { id: '1', title: '50 Push-ups', category: 'fitness', xpReward: 30, completed: false },
  { id: '2', title: '30 min Run', category: 'fitness', xpReward: 40, completed: false },
  { id: '3', title: 'Read 20 pages', category: 'learning', xpReward: 25, completed: false },
  { id: '4', title: 'Study 1 hour', category: 'learning', xpReward: 35, completed: false },
  { id: '5', title: 'Complete top 3 tasks', category: 'productivity', xpReward: 40, completed: false },
  { id: '6', title: '10 min meditation', category: 'wellness', xpReward: 20, completed: false },
  { id: '7', title: 'Drink 3L water', category: 'wellness', xpReward: 15, completed: false },
  { id: '8', title: 'Eat clean meals', category: 'diet', xpReward: 25, completed: false },
  { id: '9', title: 'No junk food', category: 'diet', xpReward: 20, completed: false },
];

const DEFAULT_HABITS: HabitEntry[] = [
  { id: 'h1', name: 'Morning Workout', category: 'fitness', streak: 0, lastCompleted: null, completedToday: false },
  { id: 'h2', name: 'Read Daily', category: 'learning', streak: 0, lastCompleted: null, completedToday: false },
  { id: 'h3', name: 'No Sugar', category: 'diet', streak: 0, lastCompleted: null, completedToday: false },
  { id: 'h4', name: 'Sleep by 11pm', category: 'wellness', streak: 0, lastCompleted: null, completedToday: false },
];

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.3, level - 1));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

const STORAGE_KEY = 'solo-leveling-state';

export function loadState(): PlayerState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const state: PlayerState = JSON.parse(saved);
    const today = getToday();
    // Reset daily quests if new day
    if (state.lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      state.quests = state.quests.map(q => ({ ...q, completed: false }));
      
      // Load tomorrow's quests (added from previous day)
      const tomorrowKey = 'solo-leveling-tomorrow-quests';
      const tomorrowQuests = JSON.parse(localStorage.getItem(tomorrowKey) || '[]');
      if (tomorrowQuests.length > 0) {
        state.quests = [...state.quests, ...tomorrowQuests.map((q: Quest) => ({ ...q, completed: false }))];
        localStorage.removeItem(tomorrowKey);
      }
      
      state.habits = state.habits.map(h => {
        if (h.lastCompleted === yesterdayStr && h.completedToday) {
          return { ...h, completedToday: false };
        }
        if (h.lastCompleted !== yesterdayStr && h.completedToday) {
          return { ...h, streak: 0, completedToday: false };
        }
        return { ...h, completedToday: false };
      });

      if (state.lastLoginDate === yesterdayStr) {
        state.dayStreak += 1;
      } else {
        state.dayStreak = 1;
      }
      state.lastLoginDate = today;
      saveState(state);
    }
    return state;
  }

  const initial: PlayerState = {
    name: 'Rahul',
    title: 'E-Rank Hunter',
    level: 1,
    xp: 0,
    xpToNext: xpForLevel(1),
    stats: { str: 5, int: 5, agi: 5, vit: 5, wis: 5 },
    statPoints: 0,
    quests: DEFAULT_QUESTS,
    habits: DEFAULT_HABITS,
    spending: [],
    totalSpent: 0,
    boss: generateBoss(1),
    lastLoginDate: getToday(),
    dayStreak: 1,
  };
  saveState(initial);
  return initial;
}

export function saveState(state: PlayerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addXP(state: PlayerState, amount: number): PlayerState {
  let newState = { ...state, xp: state.xp + amount };
  while (newState.xp >= newState.xpToNext) {
    newState.xp -= newState.xpToNext;
    newState.level += 1;
    newState.xpToNext = xpForLevel(newState.level);
    newState.statPoints += 3;
    newState.title = getRankTitle(newState.level);
  }
  return newState;
}

export function getRankTitle(level: number): string {
  if (level >= 50) return 'S-Rank Hunter';
  if (level >= 40) return 'A-Rank Hunter';
  if (level >= 30) return 'B-Rank Hunter';
  if (level >= 20) return 'C-Rank Hunter';
  if (level >= 10) return 'D-Rank Hunter';
  return 'E-Rank Hunter';
}

export function generateBoss(level: number): BossChallenge {
  const bosses = [
    { name: 'Iron Golem', description: 'Complete 7 consecutive workout days' },
    { name: 'Shadow Monarch', description: 'Master all habits for a week' },
    { name: 'Demon King', description: 'Zero junk food + daily exercise for 5 days' },
    { name: 'Ice Elf', description: 'Read 100 pages + meditate daily for 5 days' },
    { name: 'Red Gate Beast', description: 'Complete all daily quests for 3 days straight' },
  ];
  const boss = bosses[Math.floor(Math.random() * bosses.length)];
  const hp = 100 + level * 20;
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);

  return {
    id: `boss-${Date.now()}`,
    name: boss.name,
    description: boss.description,
    hpMax: hp,
    hpCurrent: hp,
    xpReward: 100 + level * 15,
    deadline: deadline.toISOString().split('T')[0],
    tasks: [
      { id: 'bt1', text: 'Day 1 challenge', done: false },
      { id: 'bt2', text: 'Day 2 challenge', done: false },
      { id: 'bt3', text: 'Day 3 challenge', done: false },
      { id: 'bt4', text: 'Day 4 challenge', done: false },
      { id: 'bt5', text: 'Day 5 challenge', done: false },
    ],
  };
}
