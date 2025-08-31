
"use client";

import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { useHourLog } from './use-hour-log';
import type { Project } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';


interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  startProjectTimer: (projectId: string) => void;
  stopProjectTimer: (projectId: string) => void;
  isLoaded: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { isLoaded, data, saveData } = useHourLog();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isLoaded) {
      const loadedProjects = (data.projects || []).map(p => ({
        ...p,
        deadline: new Date(p.deadline),
        createdAt: new Date(p.createdAt),
        isActive: p.isActive ?? false,
      })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setProjects(loadedProjects);
    }
  }, [isLoaded, data.projects]);

  const updateProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    const newData = { ...data, projects: updatedProjects };
    saveData(newData);
  };
  
  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'isActive'>) => {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: new Date(),
      isActive: false,
    };
    updateProjects([...projects, newProject]);
  }, [projects, data, saveData]);

  const startProjectTimer = (projectId: string) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, isActive: true } : p
    );
    updateProjects(updatedProjects);
  };

  const stopProjectTimer = (projectId: string) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, isActive: false } : p
    );
    updateProjects(updatedProjects);
  };
  
  const value = { projects, addProject, startProjectTimer, stopProjectTimer, isLoaded };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
