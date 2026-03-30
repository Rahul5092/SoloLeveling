export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  });
}

let reminderInterval: ReturnType<typeof setInterval> | null = null;

export function startQuestReminder(checkFn: () => { incomplete: number }) {
  stopQuestReminder();
  reminderInterval = setInterval(() => {
    const { incomplete } = checkFn();
    if (incomplete > 0) {
      sendNotification(
        '⚔️ Quests Pending!',
        `You have ${incomplete} daily quest${incomplete > 1 ? 's' : ''} remaining. Complete them to level up!`
      );
    }
  }, 2 * 60 * 60 * 1000); // Every 2 hours
}

export function stopQuestReminder() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
}
