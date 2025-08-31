
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, differenceInSeconds, intervalToDuration } from "date-fns";
import type { Project } from "@/lib/types";
import { DashboardToggleButton } from "./dashboard-toggle-button";

export const ProjectCard = ({ project }: { project: Project }) => {
  const [now, setNow] = useState(new Date());

  // This effect will only run if the project is NOT active, to save resources
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (!project.isActive) {
      timer = setInterval(() => {
        setNow(new Date());
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [project.isActive]);


  const totalSeconds = differenceInSeconds(project.deadline, project.createdAt);
  const elapsedSeconds = differenceInSeconds(now, project.createdAt);
  const percentageElapsed = totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 100;
  
  const isPastDeadline = now > project.deadline;

  const duration = intervalToDuration({
    start: isPastDeadline ? project.deadline : now,
    end: project.deadline
  });

  const formattedCountdown = isPastDeadline 
    ? "Deadline Passed"
    : `${duration.days || 0}d ${duration.hours || 0}h ${duration.minutes || 0}m ${duration.seconds || 0}s`;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>Deadline: {format(project.deadline, "PPP p")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div>
          <p className="text-sm font-medium mb-1">
            Time Remaining
          </p>
          <p className="text-2xl font-sans">
            {formattedCountdown}
          </p>
        </div>
        <Progress value={Math.min(100, percentageElapsed)} className="h-2" />
      </CardContent>
      <CardFooter>
        <DashboardToggleButton project={project} />
      </CardFooter>
    </Card>
  );
};
