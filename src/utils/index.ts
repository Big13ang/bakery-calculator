import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format wrappers
export const generateId = () => Math.random().toString(36).substring(2, 9);
export const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(Math.round(price));
export const formatDate = (ts: number | Date) => new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
}).format(new Date(ts));
