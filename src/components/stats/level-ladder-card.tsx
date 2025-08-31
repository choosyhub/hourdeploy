"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHourLog } from "@/hooks/use-hour-log";
import { cn } from "@/lib/utils";
import { levels } from "@/lib/levels";


export function LevelLadderCard() {
    const { totalHours } = useHourLog();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mastery Levels</CardTitle>
                <CardDescription>The milestones on your 10,000-hour journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Level</TableHead>
                            <TableHead className="text-right">Hours Required</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {levels.map((level) => (
                            <TableRow 
                                key={level.name} 
                                className={cn(totalHours >= level.hours && "bg-primary/10 font-semibold")}
                            >
                                <TableCell>{level.name}</TableCell>
                                <TableCell className="text-right">{level.hours.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
