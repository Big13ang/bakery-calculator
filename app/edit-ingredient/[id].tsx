import { EditIngredientScreen } from '@/screens/EditIngredientScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditIngredientRoute() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    if (!id || typeof id !== 'string') {
        return null; // Or some fallback/error UI
    }

    return (
        <EditIngredientScreen
            ingredientId={id}
            onBack={() => router.back()}
        />
    );
}
