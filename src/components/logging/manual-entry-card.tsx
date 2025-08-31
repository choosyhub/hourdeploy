
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useHourLog } from "@/hooks/use-hour-log";
import { Plus } from "lucide-react";

const formSchema = z.object({
  hours: z.coerce
    .number({ invalid_type_error: "Please enter a number." })
    .min(0.1, "Must be greater than 0.")
    .max(16, "Daily cap is 16 hours."),
});

export function ManualEntryCard() {
  const { addLog } = useHourLog();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hours: "" as any,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addLog(values.hours);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Entry</CardTitle>
        <CardDescription>Log a block of hours you've completed.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours Worked</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2.5" {...field} step="0.1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" /> Log Hours
              </Button>
            </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
