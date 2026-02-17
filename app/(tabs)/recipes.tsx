import { RecipesScreen } from '@/screens/RecipesScreen';
import { useRouter } from 'expo-router';

export default function RecipesRoute() {
    const router = useRouter();
    return (
        <RecipesScreen
            onBack={() => router.push('/')}
            onAdd={() => router.push('/recipe-form')}
            onEdit={(id) => router.push({ pathname: '/recipe-form', params: { id } })}
            onHistory={(id) => router.push({ pathname: '/recipe-history', params: { id } })}
        />
    );
}
