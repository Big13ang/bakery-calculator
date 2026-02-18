import { AddIngredientScreen } from '@/screens/AddIngredientScreen';
import { useRouter } from 'expo-router';

export default function AddIngredientRoute() {
    const router = useRouter();
    return (
        <AddIngredientScreen
            onBack={() => router.replace('/ingredients')}
        />
    );
}
