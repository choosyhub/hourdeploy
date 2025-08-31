
import { ThemeSwitcher } from "@/components/settings/theme-switcher";
import { DataManagementCard } from "@/components/stats/data-management-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
                <ThemeSwitcher />
            </CardContent>
        </Card>
        <DataManagementCard />
    </div>
  );
}
