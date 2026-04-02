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

const WEEKLY_WORKOUT_PLAN: Record<string, Omit<Quest, 'completed'>[]> = {
  Monday: [
    { id: 'workout-monday-barbell-squat', title: 'Barbell Squat (4×3–6)', category: 'fitness', xpReward: 35 },
    { id: 'workout-monday-hack-squat', title: 'Hack Squat (3×8–10)', category: 'fitness', xpReward: 30 },
    { id: 'workout-monday-leg-press', title: 'Leg Press (3×10–12)', category: 'fitness', xpReward: 30 },
    { id: 'workout-monday-leg-extension', title: 'Leg Extension (3×12–15)', category: 'fitness', xpReward: 25 },
    { id: 'workout-monday-seated-leg-curl', title: 'Seated Leg Curl (3×12–15)', category: 'fitness', xpReward: 25 },
    { id: 'workout-monday-crunch', title: 'Crunches (3×12–15)', category: 'fitness', xpReward: 15 },
    { id: 'workout-monday-hanging-leg-raises', title: 'Hanging Leg Raises (3×10–15)', category: 'fitness', xpReward: 15 },
    { id: 'workout-monday-wrist-curls', title: 'Wrist Curls (3×15–20)', category: 'fitness', xpReward: 10 },
  ],
  Tuesday: [
    { id: 'workout-tuesday-bench-press', title: 'Bench Press (4×4–6)', category: 'fitness', xpReward: 35 },
    { id: 'workout-tuesday-incline-db-press', title: 'Incline DB Press (3×8–12)', category: 'fitness', xpReward: 30 },
    { id: 'workout-tuesday-decline-press', title: 'Decline Press (3×6–8)', category: 'fitness', xpReward: 30 },
    { id: 'workout-tuesday-chest-fly', title: 'Chest Fly (3×12–15)', category: 'fitness', xpReward: 25 },
    { id: 'workout-tuesday-barbell-curl', title: 'Barbell Curl (3×8–12)', category: 'fitness', xpReward: 25 },
    { id: 'workout-tuesday-hammer-curl', title: 'Hammer Curl (3×10–12)', category: 'fitness', xpReward: 20 },
    { id: 'workout-tuesday-cable-preacher-curl', title: 'Cable/Preacher Curl (3×12–15)', category: 'fitness', xpReward: 20 },
  ],
  Wednesday: [
    { id: 'workout-wednesday-deadlift', title: 'Deadlift (3×3–5)', category: 'fitness', xpReward: 40 },
    { id: 'workout-wednesday-romanian-deadlift', title: 'Romanian Deadlift (3×8–12)', category: 'fitness', xpReward: 30 },
    { id: 'workout-wednesday-lying-leg-curl', title: 'Lying Leg Curl (3×12–15)', category: 'fitness', xpReward: 25 },
    { id: 'workout-wednesday-overhead-press', title: 'Overhead Press (3×6–10)', category: 'fitness', xpReward: 30 },
    { id: 'workout-wednesday-db-shoulder-press', title: 'DB Shoulder Press (3×8–12)', category: 'fitness', xpReward: 25 },
    { id: 'workout-wednesday-lateral-raises', title: 'Lateral Raises (3×15–20)', category: 'fitness', xpReward: 20 },
    { id: 'workout-wednesday-rear-delt-fly', title: 'Rear Delt Fly (3×15–20)', category: 'fitness', xpReward: 20 },
  ],
  Thursday: [
    { id: 'workout-thursday-lat-pulldown', title: 'Lat Pulldown (3×8–12)', category: 'fitness', xpReward: 25 },
    { id: 'workout-thursday-barbell-row', title: 'Barbell Row (3×6–10)', category: 'fitness', xpReward: 30 },
    { id: 'workout-thursday-db-row', title: 'DB Row (3×8–12)', category: 'fitness', xpReward: 25 },
    { id: 'workout-thursday-hyperextensions', title: 'Hyperextensions (3×12–15)', category: 'fitness', xpReward: 20 },
    { id: 'workout-thursday-skull-crushers', title: 'Skull Crushers (3×8–12)', category: 'fitness', xpReward: 25 },
    { id: 'workout-thursday-rope-pushdown', title: 'Rope Pushdown (3×10–12)', category: 'fitness', xpReward: 20 },
    { id: 'workout-thursday-overhead-db-extension', title: 'Overhead DB Extension (3×10–12)', category: 'fitness', xpReward: 20 },
  ],
  Friday: [
    { id: 'workout-friday-front-squat', title: 'Front Squat (3×10–15)', category: 'fitness', xpReward: 30 },
    { id: 'workout-friday-walking-lunges', title: 'Walking Lunges (3×12/leg)', category: 'fitness', xpReward: 25 },
    { id: 'workout-friday-leg-extension', title: 'Leg Extension (3×15)', category: 'fitness', xpReward: 20 },
    { id: 'workout-friday-lying-leg-curl', title: 'Lying Leg Curl (3×15)', category: 'fitness', xpReward: 20 },
    { id: 'workout-friday-seated-calf-raise', title: 'Seated Calf Raise (4×15–20)', category: 'fitness', xpReward: 15 },
    { id: 'workout-friday-standing-calf-raise', title: 'Standing Calf Raise (4×10–15)', category: 'fitness', xpReward: 15 },
  ],
};

export function getWorkoutPlanForDay(day: string): Omit<Quest, 'completed'>[] {
  return WEEKLY_WORKOUT_PLAN[day] || [];
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.3, level - 1));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekday(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
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

      // Add the day-specific workout quests each day (if not already present)
      const todayWeekday = getWeekday();
      const dailyWorkouts = getWorkoutPlanForDay(todayWeekday);
      const existingQuestIds = new Set(state.quests.map(q => q.id));
      const newWorkoutQuests = dailyWorkouts
        .filter(q => !existingQuestIds.has(q.id))
        .map(q => ({ ...q, completed: false }));
      if (newWorkoutQuests.length > 0) {
        state.quests = [...state.quests, ...newWorkoutQuests];
      }

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
    quests: [
      ...DEFAULT_QUESTS,
      ...getWorkoutPlanForDay(getWeekday()).map((q) => ({ ...q, completed: false })),
    ],
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
