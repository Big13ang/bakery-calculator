import { DashboardScreen } from '@/screens/DashboardScreen';
import { useRouter } from 'expo-router';

export default function DashboardRoute() {
    const router = useRouter();
    return (
        <DashboardScreen
            onNavigate={(tab) => {
                const route = tab === 'dashboard' ? '/' : `/${tab}`;
                router.push(route as any); // Type casting for ease if routes not generated yet
            }}
            onAddIngredient={() => router.push('/add-ingredient')}
            onAddRecipe={() => router.push('/recipe-form')}
        />
    );
}
