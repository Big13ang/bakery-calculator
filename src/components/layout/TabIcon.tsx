import { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { cn } from '../../utils';
import { Typography } from '../ui/Typography';

interface TabIconProps {
    focused: boolean;
    icon: LucideIcon;
    label: string;
}

export const TabIcon = ({ focused, icon: Icon, label }: TabIconProps) => {
    return (
        <View
            className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-full mb-1",
                focused ? "scale-105" : "opacity-50"
            )}
        >
            <Icon
                size={26}
                color={focused ? '#D97706' : '#4A3728'}
                style={{
                    marginBottom: 4
                }}
            />
            <Typography
                variant="micro"
                className={cn(
                    "text-[10px] font-black uppercase transition-colors duration-200",
                    focused ? "text-[#D97706]" : "text-bakery-text"
                )}
            >
                {label}
            </Typography>
        </View>
    );
};
