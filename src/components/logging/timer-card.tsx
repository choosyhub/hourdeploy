
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHourLog } from "@/hooks/use-hour-log";
import { Play, Pause, RotateCcw, History, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function TimerCard() {
  const { addLog } = useHourLog();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setShowSecondConfirm(false);
  };

  const handleLogTime = () => {
    const hours = time / 3600;
    if (hours > 0) {
      addLog(hours);
    }
    handleReset();
  };

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Timer</CardTitle>
        <CardDescription>Track your hours in real-time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl sm:text-5xl font-mono font-bold text-center p-4 sm:p-6 bg-muted rounded-lg">
          {formatTime(time)}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center gap-2">
        <div className="flex w-full justify-center gap-2">
            {!isActive ? (
            <Button onClick={handleStart} className="flex-1">
                <Play className="mr-2 h-4 w-4" /> Start
            </Button>
            ) : (
            <Button onClick={handlePause} variant="secondary" className="flex-1">
                <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
            )}
            
            <Button onClick={() => setShowFirstConfirm(true)} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>
        <Button onClick={handleLogTime} disabled={time === 0 || isActive} className="w-full mt-2">
            <History className="mr-2 h-4 w-4" /> Log Elapsed Time
        </Button>
      </CardFooter>

      {/* First confirmation dialog */}
      <AlertDialog open={showFirstConfirm} onOpenChange={setShowFirstConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to reset the timer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will clear the current timer value, but will not affect your logged hours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowFirstConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowFirstConfirm(false);
              setShowSecondConfirm(true);
            }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Second confirmation dialog */}
      <AlertDialog open={showSecondConfirm} onOpenChange={setShowSecondConfirm}>
        <AlertDialogContent>
           <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-destructive" /> This will clear all tracked time. Confirm reset?
              </AlertDialogTitle>
              <AlertDialogDescription>
                  This is your final confirmation. This action cannot be undone and will permanently erase the current timer value.
              </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowSecondConfirm(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                  Yes, reset timer
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
