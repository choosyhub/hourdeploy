
import { ManualEntryCard } from "@/components/logging/manual-entry-card";
import { TimerCard } from "@/components/logging/timer-card";

export default function LogPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Log Hours</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ManualEntryCard />
        <TimerCard />
      </div>
    </div>
  );
}
