export type Progress = Record<string, { sets: boolean[]; note?: string }>;
const key = (date: string) => `ironvana-progress-${date}`;
export const readProgress = (date: string): Progress => { if (typeof window === 'undefined') return {}; try { return JSON.parse(localStorage.getItem(key(date)) || '{}') as Progress; } catch { return {}; } };
export const saveProgress = (date: string, progress: Progress) => localStorage.setItem(key(date), JSON.stringify(progress));
export const clearProgress = (date: string) => localStorage.removeItem(key(date));
export const allProgress = () => Object.keys(localStorage).filter((item) => item.startsWith('ironvana-progress-')).map((item) => ({ date: item.replace('ironvana-progress-', ''), progress: readProgress(item.replace('ironvana-progress-', '')) }));
export const clearAllProgress = () => Object.keys(localStorage).filter((item) => item.startsWith('ironvana-progress-')).forEach((item) => localStorage.removeItem(item));
