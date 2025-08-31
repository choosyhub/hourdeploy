"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHourLog } from "@/hooks/use-hour-log";
import { convertHoursToReadableTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Hourglass, Target, CheckCircle } from "lucide-react";

const TARGET_HOURS = 10000;

const StatCard = ({ title, value, icon: Icon, readableTime, isLoading }: { title: string; value: string; icon: React.ElementType; readableTime?: string; isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    {readableTime !== undefined && <Skeleton className="h-4 w-1/2" />}
                </div>
            ) : (
                <>
                    <div className="text-2xl font-bold">{value}</div>
                    {readableTime && <p className="text-xs text-muted-foreground">{readableTime}</p>}
                </>
            )}
        </CardContent>
    </Card>
);

export function OverviewCards() {
    const { totalHours, remainingHours, isLoaded } = useHourLog();

    const cards = [
        {
            title: "Hours Logged",
            value: totalHours.toLocaleString(undefined, { maximumFractionDigits: 1 }),
            icon: CheckCircle,
            readableTime: convertHoursToReadableTime(totalHours),
        },
        {
            title: "Hours Remaining",
            value: remainingHours.toLocaleString(undefined, { maximumFractionDigits: 1 }),
            icon: Hourglass,
            readableTime: convertHoursToReadableTime(remainingHours),
        },
        {
            title: "Target",
            value: TARGET_HOURS.toLocaleString(),
            icon: Target,
        },
    ];

    return (
        <>
            {cards.map((card, index) => (
                <StatCard 
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    readableTime={card.readableTime}
                    isLoading={!isLoaded}
                />
            ))}
        </>
    );
}
