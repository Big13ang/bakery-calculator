import { ThemeConfig } from '../types';

export const themes: ThemeConfig[] = [
    {
        id: 'bakery-classic',
        name: 'نانوایی کلاسیک',
        bg: 'bg-[#FDF8F1]',
        card: 'bg-white',
        text: 'text-[#4A3728]',
        accent: 'bg-[#D97706]',
        secondary: 'bg-[#F9F1E5]',
        border: 'border-[#D9C4A9]',
        radius: 'rounded-2xl',
        shadow: 'shadow-md',
        font: 'font-sans', // In RN we will handle fonts differently, but keeping token for ref
        danger: 'text-[#7C2D12]'
    }
];

export const theme = themes[0];
