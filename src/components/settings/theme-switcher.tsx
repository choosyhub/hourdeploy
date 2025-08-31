
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Laptop } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-5 w-20" />
                <div className="grid max-w-md grid-cols-1 gap-4 sm:grid-cols-3">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Label>Theme</Label>
             <RadioGroup 
                value={theme}
                onValueChange={setTheme} 
                className="grid max-w-md grid-cols-1 gap-4 sm:grid-cols-3"
            >
                <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="light" className="sr-only" />
                    <Sun className="mb-2 h-6 w-6" />
                    Light
                </Label>
                 <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="dark" className="sr-only" />
                    <Moon className="mb-2 h-6 w-6" />
                    Dark
                </Label>
                 <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="system" className="sr-only" />
                    <Laptop className="mb-2 h-6 w-6" />
                    System
                </Label>
            </RadioGroup>
        </div>
    );
}
