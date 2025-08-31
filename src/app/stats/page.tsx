import { ProgressChart } from "@/components/stats/progress-chart";
import { LevelProgressCard } from "@/components/stats/level-progress-card";
import { LevelLadderCard } from "@/components/stats/level-ladder-card";

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <ProgressChart />
        </div>
        <div className="flex flex-col gap-6">
            <LevelProgressCard />
        </div>
      </div>
      <LevelLadderCard />
    </div>
  );
}
