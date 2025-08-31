
'use client';

import { OverviewCards } from '@/components/dashboard/overview-cards';
import { ProjectionCard } from '@/components/dashboard/projection-card';
import { useHourLog } from '@/hooks/use-hour-log';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LevelCard } from '@/components/dashboard/level-card';
import { LevelProgressCard } from '@/components/stats/level-progress-card';
import { useProject } from '@/hooks/use-project';
import { ProjectCard } from '@/components/project/project-card';
import { FolderKanban } from 'lucide-react';

const TARGET_HOURS = 10000;

export default function Home() {
  const { totalHours, isLoaded } = useHourLog();
  const { projects } = useProject();
  const percentage = isLoaded ? (totalHours / TARGET_HOURS) * 100 : 0;
  
  const activeProjects = projects.filter(p => p.isActive);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCards />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <LevelCard />
        <LevelProgressCard />
      </div>

      {activeProjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Active Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Progress to 10,000 Hours</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoaded ? (
                <div className="space-y-2">
                    <Progress value={percentage} />
                    <p className="text-sm text-muted-foreground">{percentage.toFixed(2)}% complete</p>
                </div>
                ) : (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <ProjectionCard />
      </div>
    </div>
  );
}
