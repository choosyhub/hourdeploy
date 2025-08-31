
"use client";

import { createContext, useContext } from 'react';
import { calculateLevelInfo } from '@/lib/levels';
import type { GistData, LogEntry } from '@/lib/types';

export const TARGET_HOURS = 10000;

export interface HourLogContextType {
  logs: LogEntry[];
  totalHours: number;
  remainingHours: number;
  dailyAverageHours: number;
  levelInfo: ReturnType<typeof calculateLevelInfo>;
  addLog: (hours: number) => void;
  exportData: () => void;
  resetData: () => void;
  isLoaded: boolean;
  refetch: () => void;
  saveData: (newData: GistData) => Promise<void>;
  data: GistData;
}

export const HourLogContext = createContext<HourLogContextType | undefined>(undefined);

export function useHourLog() {
  const context = useContext(HourLogContext);
  if (context === undefined) {
    throw new Error('useHourLog must be used within an HourLogProvider');
  }
  return context;
}
