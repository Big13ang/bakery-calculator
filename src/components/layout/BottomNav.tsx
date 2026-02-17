import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../utils';
import { Icons } from '../ui/Icons';
import { Typography } from '../ui/Typography';

const BottomNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();

    const tabs = [
        { id: 'index', label: 'داشبورد', icon: Icons.Home },
        { id: 'ingredients', label: 'مواد اولیه', icon: Icons.Package },
        { id: 'recipes', label: 'دستور پخت', icon: Icons.ChefHat },
        { id: 'analysis', label: 'تحلیل', icon: Icons.BarChart },
        { id: 'settings', label: 'تنظیمات', icon: Icons.Settings },
    ];

    return (
        <View
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-bakery-border flex-row justify-around items-center z-50 shadow-2xl pt-2 px-2"
        >
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const tabItem = tabs.find(t => t.id === route.name);
                if (!tabItem) return null;

                const onPress = () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const Icon = tabItem.icon;

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        activeOpacity={0.8}
                        className={cn(
                            "flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 rounded-full relative",
                            isFocused ? "bg-bakery-accent shadow-md scale-110" : "opacity-60"
                        )}
                    >
                        <Icon
                            size={20}
                            color={isFocused ? '#FFFFFF' : '#4A3728'}
                            style={{
                                marginBottom: 2
                            }}
                        />
                        <Typography
                            variant="micro"
                            className={cn(
                                "text-[8px] font-black uppercase",
                                isFocused ? "text-white" : "text-bakery-text"
                            )}
                        >
                            {tabItem.label}
                        </Typography>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BottomNav;
