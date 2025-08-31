
"use client";

import { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { readData, writeData } from '@/lib/data';
import { downloadJson } from '@/lib/utils';
import { calculateLevelInfo } from '@/lib/levels';
import { HourLogContext, TARGET_HOURS, HourLogContextType } from '@/hooks/use-hour-log';
import { format } from 'date-fns';
import type { GistData, LogEntry } from '@/lib/types';

export function HourLogProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GistData>({ logs: [], projects: [], totalHours: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoaded(false);
    try {
      const fileData = await readData();
      setData(fileData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Loading Error",
        description: `Could not load data from file. ${errorMessage}`,
      });
    } finally {
      setIsLoaded(true);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const saveData = useCallback(async (newData: GistData) => {
    try {
        await writeData(newData);
        setData(newData);
    } catch (error) {
        console.error("Failed to save data:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Save Error",
            description: `Could not save your data to file. ${errorMessage}`,
        });
    }
  }, [toast]);

  const addLog = useCallback((hours: number) => {
    const newLog: LogEntry = {
      date: format(new Date(), 'yyyy-MM-dd'),
      hours,
    };

    const newData: GistData = {
      ...data,
      logs: [...data.logs, newLog],
      totalHours: data.totalHours + hours,
    };
    
    saveData(newData);

    toast({
        title: "Hours Logged",
        description: `${hours} hour(s) have been added to your log.`,
    });
  }, [data, saveData, toast]);

  const resetData = useCallback(() => {
    const emptyData: GistData = {
        logs: [],
        projects: [],
        totalHours: 0,
    };
    saveData(emptyData);
    toast({
      title: 'Data Reset',
      description: 'Your entire log history has been cleared.',
    });
  }, [saveData, toast]);

  const dailyAverageHours = useMemo(() => {
    if (data.logs.length === 0) return 0;
    const uniqueDays = new Set(data.logs.map(log => log.date));
    if (uniqueDays.size === 0) return 0;
    return data.totalHours / uniqueDays.size;
  }, [data.logs, data.totalHours]);

  const levelInfo = useMemo(() => calculateLevelInfo(data.totalHours), [data.totalHours]);

  const exportData = useCallback(() => {
    downloadJson({ logs: data.logs, totalHours: data.totalHours, projects: data.projects }, 'hourglass-horizons-backup');
    toast({
      title: 'Data Exported',
      description: 'Your log history has been downloaded.',
    });
  }, [data, toast]);

  const value: HourLogContextType = {
    logs: data.logs,
    totalHours: data.totalHours,
    remainingHours: TARGET_HOURS - data.totalHours,
    dailyAverageHours,
    levelInfo,
    addLog,
    exportData,
    resetData,
    isLoaded,
    refetch: fetchData,
    saveData,
    data,
  };

  return <HourLogContext.Provider value={value}>{children}</HourLogContext.Provider>;
}
