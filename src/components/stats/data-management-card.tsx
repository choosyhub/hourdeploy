
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHourLog } from "@/hooks/use-hour-log";
import { Download } from "lucide-react";

export function DataManagementCard() {
    const { exportData, isLoaded } = useHourLog();

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export your progress data.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                <Button onClick={exportData} disabled={!isLoaded}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </Button>
            </CardContent>
        </Card>
    );
}
