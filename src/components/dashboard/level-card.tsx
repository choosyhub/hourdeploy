"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHourLog } from "@/hooks/use-hour-log";
import { Trophy } from "lucide-react";

export function LevelCard() {
    const { levelInfo, isLoaded } = useHourLog();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoaded ? (
                    <div className="text-4xl font-bold">{levelInfo.level}</div>
                ) : (
                    <Skeleton className="h-10 w-1/2" />
                )}
            </CardContent>
        </Card>
    );
}
