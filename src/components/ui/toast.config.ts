export interface ToastProps {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    duration?: number;
}

export const TOAST_THEMES = {
    success: {
        borderColor: '#10B981',
        iconName: 'Package' as const,
        iconColor: '#10B981',
        bgColor: '#ECFDF5',
    },
    error: {
        borderColor: '#EF4444',
        iconName: 'X' as const,
        iconColor: '#EF4444',
        bgColor: '#FEF2F2',
    },
    warning: {
        borderColor: '#F59E0B',
        iconName: 'TrendingUp' as const,
        iconColor: '#F59E0B',
        bgColor: '#FFFBEB',
    },
    info: {
        borderColor: '#D9C4A9',
        iconName: 'Package' as const,
        iconColor: '#4A3728',
        bgColor: '#FFFFFF',
    },
};
