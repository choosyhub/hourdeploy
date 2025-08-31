
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHourLog } from "@/hooks/use-hour-log";
import { getProjectedEndDate } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export function ProjectionCard() {
    const { totalHours, dailyAverageHours, isLoaded } = useHourLog();
    const [projection, setProjection] = useState<{ endDate: string; remainingDays: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const handleProjection = () => {
            setError(null);
            setProjection(null);
            startTransition(async () => {
                const result = await getProjectedEndDate({
                    totalHoursLogged: totalHours,
                    dailyAverageHours: dailyAverageHours,
                    fixedDailyHours: 16,
                });

                if (result.success) {
                    setProjection({
                        endDate: format(new Date(result.data.estimatedEndDate), "MMMM d, yyyy"),
                        remainingDays: result.data.remainingDays,
                    });
                } else {
                    setError(result.error);
                }
            });
        };
        
        if (isLoaded) {
            handleProjection();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, totalHours, dailyAverageHours]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>End Date Projection</CardTitle>
                <CardDescription>Estimated completion date based on a fixed pace of 16 hours/day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isPending && (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                )}

                {!isPending && projection && (
                     <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Estimated Completion</AlertTitle>
                        <AlertDescription>
                            <p className="font-bold text-lg">{projection.endDate}</p>
                            <p>Approximately {projection.remainingDays.toLocaleString()} days remaining.</p>
                        </AlertDescription>
                    </Alert>
                )}

                {!isPending && error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Projection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
