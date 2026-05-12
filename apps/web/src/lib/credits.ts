const CREDITS_KEY = 'moonlight_credits';
const USAGE_KEY = 'moonlight_usage';

interface UsageRecord {
  date: string;
  clipsGenerated: number;
}

function getStorage(): Storage | null {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

export function getCredits(): number {
  const storage = getStorage();
  if (!storage) return 10;
  const val = storage.getItem(CREDITS_KEY);
  return val ? parseInt(val, 10) : 10;
}

export function setCredits(amount: number): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(CREDITS_KEY, amount.toString());
}

export function deductCredits(amount: number = 1): boolean {
  const current = getCredits();
  if (current < amount) return false;
  setCredits(current - amount);

  const usage = getUsage();
  usage.clipsGenerated += amount;
  setUsage(usage);

  return true;
}

export function getUsage(): UsageRecord {
  const storage = getStorage();
  if (!storage) return { date: new Date().toISOString().slice(0, 7), clipsGenerated: 0 };
  const val = storage.getItem(USAGE_KEY);
  if (!val) {
    const record: UsageRecord = {
      date: new Date().toISOString().slice(0, 7),
      clipsGenerated: 0,
    };
    setUsage(record);
    return record;
  }
  const parsed = JSON.parse(val) as UsageRecord;
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (parsed.date !== currentMonth) {
    const newRecord: UsageRecord = { date: currentMonth, clipsGenerated: 0 };
    setUsage(newRecord);
    return newRecord;
  }
  return parsed;
}

function setUsage(record: UsageRecord): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(USAGE_KEY, JSON.stringify(record));
}

export function getCreditsRemaining(): number {
  return getCredits();
}

export function hasCredits(amount: number = 1): boolean {
  return getCredits() >= amount;
}
