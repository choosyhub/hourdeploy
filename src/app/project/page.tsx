
"use client";

import { useProject } from "@/hooks/use-project";
import { ProjectCard } from "@/components/project/project-card";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHourLog } from "@/hooks/use-hour-log";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const NewProjectDialog = () => {
    const { addProject } = useProject();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState<Date | undefined>();

    const handleSubmit = () => {
        if (name && deadline) {
            addProject({ name, deadline });
            setOpen(false);
            setName("");
            setDeadline(undefined);
        }
    };
    
    const handleDateSelect = (date: Date | undefined) => {
        if (!date) {
            setDeadline(undefined);
            return;
        }
        const currentDeadline = deadline || new Date();
        const newDeadline = new Date(date);
        newDeadline.setHours(currentDeadline.getHours(), currentDeadline.getMinutes());
        setDeadline(newDeadline);
    }
    
    const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
        if (!deadline) return;
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) return;
        
        const isPM = deadline.getHours() >= 12;

        let newDeadline: Date;
        if (type === 'hours') {
            const hours12 = numericValue % 12;
            const hours24 = isPM ? hours12 + 12 : hours12;
            newDeadline = setHours(deadline, hours24);
        } else {
            newDeadline = setMinutes(deadline, numericValue);
        }
        setDeadline(newDeadline);
    }
    
    const handlePeriodChange = (period: 'am' | 'pm') => {
        if (!deadline) return;
        const currentHours = deadline.getHours();
        if (period === 'pm' && currentHours < 12) {
            setDeadline(setHours(deadline, currentHours + 12));
        } else if (period === 'am' && currentHours >= 12) {
            setDeadline(setHours(deadline, currentHours - 12));
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>Set a name and deadline for your new project.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">Deadline</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !deadline && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deadline ? format(deadline, "PPP p") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={deadline} onSelect={handleDateSelect} initialFocus />
                                <div className="p-4 border-t flex items-end gap-2">
                                     <div className="grid gap-1">
                                        <Label htmlFor="hours">Hours</Label>
                                        <Input
                                            id="hours"
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={deadline ? format(deadline, 'h') : ''}
                                            onChange={(e) => handleTimeChange('hours', e.target.value)}
                                            className="w-16"
                                            disabled={!deadline}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label htmlFor="minutes">Minutes</Label>
                                        <Input
                                            id="minutes"
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={deadline ? format(deadline, 'mm') : ''}
                                            onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                            className="w-16"
                                            disabled={!deadline}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label>Period</Label>
                                        <ToggleGroup 
                                            type="single"
                                            disabled={!deadline}
                                            value={deadline ? format(deadline, 'a').toLowerCase() : ''}
                                            onValueChange={(value) => {
                                                if (value === 'am' || value === 'pm') handlePeriodChange(value)
                                            }}
                                        >
                                            <ToggleGroupItem value="am">AM</ToggleGroupItem>
                                            <ToggleGroupItem value="pm">PM</ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!name || !deadline}>Create Project</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function ProjectPage() {
  const { projects } = useProject();
  const { isLoaded } = useHourLog();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex gap-2">
           <NewProjectDialog />
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64">
            <FolderKanban className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">No projects yet.</p>
            <p className="text-sm text-muted-foreground">Click "New Project" to add your first one.</p>
        </div>
      )}
    </div>
  );
}
