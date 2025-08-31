
export interface LogEntry {
  date: string;
  hours: number;
}

export interface Project {
  id: string;
  name: string;
  deadline: Date;
  createdAt: Date;
  isActive?: boolean;
}

export interface GistData {
  logs: LogEntry[];
  projects: Project[];
  totalHours: number;
}
