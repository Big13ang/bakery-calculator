import { RecipeFormScreen } from '@/screens/RecipeFormScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RecipeFormRoute() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <RecipeFormScreen
            key={id || 'new'}
            onBack={() => router.back()}
            editRecipeId={id}
        />
    );
}
