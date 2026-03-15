import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}
