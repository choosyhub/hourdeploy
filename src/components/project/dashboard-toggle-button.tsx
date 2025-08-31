
"use client";

import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import type { Project } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";

export function DashboardToggleButton({ project }: { project: Project }) {
    const { startProjectTimer, stopProjectTimer } = useProject();
    
    const handleToggle = () => {
        if (project.isActive) {
            stopProjectTimer(project.id);
        } else {
            startProjectTimer(project.id);
        }
    };

    return (
        <Button onClick={handleToggle} variant="outline" className="w-full">
            {project.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {project.isActive ? "Hide from Dashboard" : "Show on Dashboard"}
        </Button>
    );
}
