import { create } from 'zustand';

export type UploadStatus = 'idle' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
export type ClipStatus = 'generating' | 'ready' | 'exporting' | 'exported';

export interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: UploadStatus;
  createdAt: string;
}

export interface ClipItem {
  id: string;
  uploadId: string;
  thumbnail?: string;
  duration: number;
  score: number;
  status: ClipStatus;
  title: string;
}

export interface QueueItem {
  id: string;
  name: string;
  stage: string;
  progress: number;
}

interface DashboardState {
  credits: number;
  plan: string;
  isPremium: boolean;
  watermarkEnabled: boolean;
  uploads: UploadItem[];
  clips: ClipItem[];
  queue: QueueItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addUpload: (upload: UploadItem) => void;
  updateUpload: (id: string, data: Partial<UploadItem>) => void;
  removeUpload: (id: string) => void;
  addClip: (clip: ClipItem) => void;
  updateClip: (id: string, data: Partial<ClipItem>) => void;
  addToQueue: (item: QueueItem) => void;
  updateQueue: (id: string, data: Partial<QueueItem>) => void;
  removeFromQueue: (id: string) => void;
  useCredits: (amount: number) => void;
  setPlan: (plan: string) => void;
  setWatermark: (enabled: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  credits: 10,
  plan: 'free',
  isPremium: false,
  watermarkEnabled: true,
  uploads: [],
  clips: [],
  queue: [],
  activeTab: 'uploads',
  setActiveTab: (tab) => set({ activeTab: tab }),
  addUpload: (upload) => set((s) => ({ uploads: [upload, ...s.uploads] })),
  updateUpload: (id, data) =>
    set((s) => ({
      uploads: s.uploads.map((u) => (u.id === id ? { ...u, ...data } : u)),
    })),
  removeUpload: (id) =>
    set((s) => ({ uploads: s.uploads.filter((u) => u.id !== id) })),
  addClip: (clip) => set((s) => ({ clips: [clip, ...s.clips] })),
  updateClip: (id, data) =>
    set((s) => ({
      clips: s.clips.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  addToQueue: (item) => set((s) => ({ queue: [...s.queue, item] })),
  updateQueue: (id, data) =>
    set((s) => ({
      queue: s.queue.map((q) => (q.id === id ? { ...q, ...data } : q)),
    })),
  removeFromQueue: (id) =>
    set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
  useCredits: (amount) =>
    set((s) => ({ credits: Math.max(0, s.credits - amount) })),
  setPlan: (plan) =>
    set(() => ({
      plan,
      isPremium: plan !== 'free',
      watermarkEnabled: plan === 'free',
    })),
  setWatermark: (enabled) => set({ watermarkEnabled: enabled }),
}));
