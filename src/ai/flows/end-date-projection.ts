'use server';

/**
 * @fileOverview A flow that analyzes logged hours and projects an estimated end date.
 *
 * - projectEndDate - A function that handles the end date projection process.
 * - ProjectEndDateInput - The input type for the projectEndDate function.
 * - ProjectEndDateOutput - The return type for the projectEndDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectEndDateInputSchema = z.object({
  totalHoursLogged: z
    .number()
    .describe('The total number of hours the user has logged.'),
  dailyAverageHours: z
    .number()
    .describe('The average number of hours the user logs per day.'),
  fixedDailyHours: z
    .number()
    .optional()
    .describe(
      'An optional fixed number of hours the user intends to log each day going forward.'
    ),
});
export type ProjectEndDateInput = z.infer<typeof ProjectEndDateInputSchema>;

const ProjectEndDateOutputSchema = z.object({
  estimatedEndDate: z
    .string()
    .describe(
      'The estimated end date for reaching the 10,000-hour goal, in ISO 8601 format.'
    ),
  remainingDays: z
    .number()
    .describe('The estimated remaining days to reach the goal.'),
});
export type ProjectEndDateOutput = z.infer<typeof ProjectEndDateOutputSchema>;

export async function projectEndDate(
  input: ProjectEndDateInput
): Promise<ProjectEndDateOutput> {
  return projectEndDateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectEndDatePrompt',
  input: {schema: ProjectEndDateInputSchema},
  output: {schema: ProjectEndDateOutputSchema},
  prompt: `You are a helpful assistant that projects the estimated end date for a user to reach their 10,000-hour goal.

Given the following information about the user's progress:
- Total hours logged: {{{totalHoursLogged}}}
- Average hours logged per day: {{{dailyAverageHours}}}
{{#if fixedDailyHours}}
- Fixed daily hours going forward: {{{fixedDailyHours}}}
{{/if}}

Calculate the estimated end date for reaching the 10,000-hour goal. Respond with the date in ISO 8601 format.
Also, respond with the estimated remaining days to reach the goal.

Ensure that the fixedDailyHours parameter is prioritized over the dailyAverageHours when computing the estimated end date.`,
});

const projectEndDateFlow = ai.defineFlow(
  {
    name: 'projectEndDateFlow',
    inputSchema: ProjectEndDateInputSchema,
    outputSchema: ProjectEndDateOutputSchema,
  },
  async input => {
    const targetHours = 10000;
    const remainingHours = targetHours - input.totalHoursLogged;

    let dailyHours = input.dailyAverageHours;
    if (input.fixedDailyHours) {
      dailyHours = input.fixedDailyHours;
    }

    const remainingDays = remainingHours / dailyHours;
    const estimatedEndDate = new Date();
    estimatedEndDate.setDate(estimatedEndDate.getDate() + remainingDays);

    const output = {
      estimatedEndDate: estimatedEndDate.toISOString(),
      remainingDays: Math.ceil(remainingDays),
    };

    return output;
  }
);
