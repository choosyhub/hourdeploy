import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertHoursToReadableTime(hours: number) {
  if (hours <= 0) {
    return "0 days";
  }
  const years = Math.floor(hours / (365 * 24));
  const remainingHoursAfterYears = hours % (365 * 24);
  const months = Math.floor(remainingHoursAfterYears / (30 * 24));
  const remainingHoursAfterMonths = remainingHoursAfterYears % (30 * 24);
  const days = Math.floor(remainingHoursAfterMonths / 24);
  const remainingHours = Math.floor(remainingHoursAfterMonths % 24);

  let result = [];
  if (years > 0) result.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) result.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
  if (remainingHours > 0) result.push(`${remainingHours} hour${remainingHours > 1 ? 's' : ''}`);

  return result.length > 0 ? result.join(', ') : "0 hours";
}

export function downloadJson(data: unknown, filename: string) {
  if (typeof window === "undefined") return;
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${filename}.json`;
  link.click();
}
