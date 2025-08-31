'use server';

import {
  projectEndDate,
  type ProjectEndDateInput,
  type ProjectEndDateOutput,
} from '@/ai/flows/end-date-projection';


type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getProjectedEndDate(
  input: ProjectEndDateInput
): Promise<ActionResult<ProjectEndDateOutput>> {
  try {
    if (input.totalHoursLogged >= 10000) {
        return { success: true, data: { estimatedEndDate: new Date().toISOString(), remainingDays: 0 } };
    }
    if ((input.dailyAverageHours <= 0 && !input.fixedDailyHours) || (input.fixedDailyHours !== undefined && input.fixedDailyHours <= 0)) {
        return { success: false, error: 'Cannot project with zero or negative daily hours.' };
    }

    const result = await projectEndDate(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error projecting end date:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to project end date: ${errorMessage}` };
  }
}
