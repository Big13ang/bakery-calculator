import { Text, TextProps } from 'react-native';
import { cn } from '../../utils';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'micro';
    weight?: 'bold' | 'black' | 'regular';
    className?: string;
}

export const Typography = ({
    variant = 'body',
    weight = 'regular',
    className,
    style,
    children,
    ...props
}: TypographyProps) => {
    const baseStyles = 'text-bakery-text';

    const variants = {
        h1: 'text-2xl font-display', // Lalezar
        h2: 'text-xl font-display',
        h3: 'text-lg font-display',
        body: 'text-base font-body', // Vazirmatn
        caption: 'text-xs font-body',
        micro: 'text-[10px] uppercase font-black',
    };

    return (
        <Text
            className={cn(baseStyles, variants[variant], className)}
            style={style}
            {...props}
        >
            {children}
        </Text>
    );
};
