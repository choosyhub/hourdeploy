"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useHourLog } from "@/hooks/use-hour-log";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { levels } from "@/lib/levels";

const CircularProgress = ({ progress }: { progress: number }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
      <circle
        stroke="hsl(var(--secondary))"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="hsl(var(--primary))"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        transform={`rotate(-90 ${radius} ${radius})`}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="transition-all duration-300 ease-in-out"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-2xl font-bold fill-foreground"
      >
        {`${Math.round(progress)}%`}
      </text>
    </svg>
  );
};

export function LevelProgressCard() {
    const { levelInfo, isLoaded } = useHourLog();

    if (!isLoaded) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Level: {levelInfo.level}</CardTitle>
                <CardDescription>Your rank on the path to mastery.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <CircularProgress progress={levelInfo.progress} />
                <div className="text-center">
                    {levelInfo.level !== "Mastery" ? (
                        <p className="text-muted-foreground">
                            <span className="font-bold text-foreground">{levelInfo.hoursForNext.toFixed(1)}</span> hours until next level ({levels.find(l => l.hours === levelInfo.nextLevelHours)?.name})
                        </p>
                    ) : (
                         <p className="font-bold text-primary">Congratulations! You have achieved Mastery!</p>
                    )}
                     <p className="text-sm text-muted-foreground">
                        {levelInfo.currentLevelHours.toFixed(1)} / {levelInfo.nextLevelHours.toLocaleString()} hours
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
