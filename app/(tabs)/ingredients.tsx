import { IngredientsScreen } from '@/screens/IngredientsScreen';
import { useRouter } from 'expo-router';

export default function IngredientsRoute() {
    const router = useRouter();
    return (
        <IngredientsScreen
            onBack={() => router.push('/')}
            onAdd={() => router.push('/add-ingredient')}
        />
    );
}
