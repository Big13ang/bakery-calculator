import { SettingsScreen } from '@/screens/SettingsScreen';
import { useRouter } from 'expo-router';

export default function SettingsRoute() {
    const router = useRouter();
    return (
        <SettingsScreen
            onNavigate={(tab) => {
                const route = tab === 'dashboard' ? '/' : `/${tab}`;
                router.push(route as any);
            }}
        />
    );
}
