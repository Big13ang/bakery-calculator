import { RecipeHistoryScreen } from '@/screens/RecipeHistoryScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RecipeHistoryRoute() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    if (!id) return null; // Should handle error or redirect

    return (
        <RecipeHistoryScreen
            recipeId={id}
            onBack={() => router.back()}
        />
    );
}
