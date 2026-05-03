import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
  selectedTopic: string | null;
  setSelectedTopic: (topic: string | null) => void;
  roadmap: any[];
  setRoadmap: (roadmap: any[]) => void;
  readinessAnswers: boolean[];
  setReadinessAnswers: (answers: boolean[]) => void;
  isGuidancePanelOpen: boolean;
  setGuidancePanelOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  selectedTopic: null,
  setSelectedTopic: (topic) => set({ selectedTopic: topic, isGuidancePanelOpen: !!topic }),
  roadmap: [],
  setRoadmap: (roadmap) => set({ roadmap }),
  readinessAnswers: new Array(7).fill(false),
  setReadinessAnswers: (answers) => set({ readinessAnswers: answers }),
  isGuidancePanelOpen: false,
  setGuidancePanelOpen: (isOpen) => set({ isGuidancePanelOpen: isOpen }),
}));
