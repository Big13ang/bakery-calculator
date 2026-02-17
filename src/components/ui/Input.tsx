import { TextInput, TextInputProps, View } from 'react-native';
import { cn } from '../../utils';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
    label?: string;
    containerClassName?: string;
}

export const Input = ({ label, containerClassName, className, ...props }: InputProps) => {
    return (
        <View className={cn("gap-2", containerClassName)}>
            {label && (
                <Typography variant="micro" className="opacity-80 pr-1 text-left">
                    {label}
                </Typography>
            )}
            <TextInput
                className={cn(
                    "w-full h-[52px] p-4 rounded-2xl bg-bakery-soft border border-bakery-border font-body text-bakery-text text-sm text-right",
                    className
                )}
                placeholderTextColor="#4A372880"
                {...props}
            />
        </View>
    );
};
