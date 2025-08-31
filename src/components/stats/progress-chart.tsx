
"use client";

import { useHourLog } from "@/hooks/use-hour-log";
import type { LogEntry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { format, addDays, differenceInDays } from "date-fns";

const TARGET_HOURS = 10000;
const IDEAL_DAILY_HOURS = 16;

const processChartData = (logs: LogEntry[]) => {
  if (logs.length === 0) return [];

  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const startDate = new Date(sortedLogs[0].date);
  const endDate = new Date();
  const totalDays = differenceInDays(endDate, startDate) + 1;

  const logMap = new Map(sortedLogs.map(log => [log.date, log.hours]));

  let cumulativeActual = 0;
  let cumulativeIdeal = 0;

  return Array.from({ length: totalDays }).map((_, i) => {
    const date = addDays(startDate, i);
    const dateString = format(date, 'yyyy-MM-dd');
    const actualHoursToday = logMap.get(dateString) || 0;

    cumulativeActual += actualHoursToday;
    cumulativeIdeal += IDEAL_DAILY_HOURS;

    return {
      date: format(date, "MMM d"),
      actual: cumulativeActual,
      ideal: Math.min(cumulativeIdeal, TARGET_HOURS),
    };
  });
};

export function ProgressChart() {
  const { logs, isLoaded } = useHourLog();
  const chartData = useMemo(() => processChartData(logs), [logs]);

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Progress</CardTitle>
          <CardDescription>Loading chart...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[400px] w-full bg-muted animate-pulse rounded-lg" />
      </Card>
    );
  }
  
  if (logs.length === 0) {
      return (
         <Card>
            <CardHeader>
                <CardTitle>Cumulative Progress</CardTitle>
                <CardDescription>Your progress towards the 10,000-hour goal.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Log some hours to see your progress chart.</p>
            </CardContent>
         </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Progress</CardTitle>
        <CardDescription>
          Your cumulative hours logged versus an ideal pace of {IDEAL_DAILY_HOURS} hours/day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
            actual: { label: "Your Progress", color: "hsl(var(--primary))" },
            ideal: { label: "Ideal Pace", color: "hsl(var(--accent))" },
        }} className="h-[300px] sm:h-[400px] w-full">
            <AreaChart data={chartData} margin={{ left: 0, right: 12, top: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value, index) => {
                        const date = new Date(chartData[index]?.date + ' ' + new Date().getFullYear())
                        if (chartData.length > 30 && (date.getDate() !== 1)) return '';
                        return value;
                    }}
                />
                <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: -5 }}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <defs>
                    <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                     <linearGradient id="fillIdeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="ideal"
                    type="natural"
                    fill="url(#fillIdeal)"
                    stroke="hsl(var(--accent))"
                    stackId="a"
                />
                <Area
                    dataKey="actual"
                    type="natural"
                    fill="url(#fillActual)"
                    stroke="hsl(var(--primary))"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
