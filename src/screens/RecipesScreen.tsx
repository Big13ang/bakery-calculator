import { useState } from 'react';
import { FlatList, Platform, TouchableOpacity, UIManager, View } from 'react-native';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/EmptyState';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { SearchInput } from '../components/ui/SearchInput';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { useKeyboardVisible } from '../hooks/useKeyboardVisible';
import { formatPrice } from '../utils';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface RecipesScreenProps {
    onBack: () => void;
    onAdd: () => void;
    onEdit: (id: string) => void;
    onHistory: (id: string) => void;
}

export const RecipesScreen = ({ onBack, onAdd, onEdit, onHistory }: RecipesScreenProps) => {
    const { recipes, deleteRecipe, ingredients, units } = useApp();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const isKeyboardVisible = useKeyboardVisible();

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const filteredRecipes = recipes.filter(recipe => {
        if (!searchQuery.trim()) return true;
        const normalizedQuery = searchQuery.trim().toLowerCase();
        
        // Search by recipe name
        const matchName = recipe.name.toLowerCase().includes(normalizedQuery);
        if (matchName) return true;
        
        // Search by ingredient names
        const matchIngredients = recipe.ingredients.some(ri => {
            const ing = ingredients.find(ingr => ingr.id === ri.ingredientId);
            return ing?.name.toLowerCase().includes(normalizedQuery);
        });
        
        return matchIngredients;
    });

    return (
        <Screen scrollable={false} className="p-4 pt-1">
            <Header
                title="دستورات پخت"
                onBack={onBack}
                actionButton={
                    <Button variant="primary" size="icon" onPress={onAdd} className="rounded-xl w-10 h-10 p-0 items-center justify-center shadow-md">
                        <Icons.Plus size={20} color="white" />
                    </Button>
                }
                className="mb-4"
            />

            <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="جستجو در دستورات پخت و مواد اولیه..."
                containerClassName="mb-4 mx-1"
            />

            <FlatList
                data={filteredRecipes}
                keyExtractor={item => item.id}
                renderItem={({ item: recipe }) => {
                    const isExpanded = expandedId === recipe.id;
                    const history = recipe.priceHistory;
                    const latestInflation = history.length >= 2
                        ? ((history[history.length - 1].newPrice - history[history.length - 2].newPrice) / history[history.length - 2].newPrice) * 100
                        : 0;

                    return (
                        <Card className="p-0 overflow-hidden mb-4">
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => toggleExpand(recipe.id)}
                                className="p-5 flex-row justify-between items-stretch"
                            >
                                <View className="flex-col gap-1 flex-1">
                                    <View className="flex-row items-center gap-2">
                                        <Typography variant="h2">{recipe.name}</Typography>
                                    </View>

                                    <Typography
                                        variant="caption"
                                        className="font-bold opacity-70 uppercase">
                                        فروش هر {units.find(u => u.id === recipe.outputUnitId)?.name || '-'}: {formatPrice(recipe.currentPrice || 0)} ت
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        className="font-black text-bakery-accent uppercase">
                                        قیمت فروش کل: {formatPrice(recipe.totalPrice || 0)} ت
                                    </Typography>
                                </View>

                                <View className="flex-col items-end justify-between self-stretch">
                                    {history.length >= 2 ? (
                                        <Badge
                                            value={`${latestInflation >= 0 ? '+' : ''}${latestInflation.toFixed(0)}٪`}
                                            label="تغییر"
                                        />
                                    ) : <View />}

                                    <View className="flex-row items-center gap-3">
                                        <View className="flex-row gap-1.5">
                                            <TouchableOpacity
                                                onPress={() => setIdToDelete(recipe.id)}
                                                className="p-2.5 rounded-xl border border-bakery-border bg-bakery-soft/50 active:scale-95 active:bg-bakery-soft"
                                            >
                                                <Icons.Trash size={15} color="#7C2D12" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => onEdit(recipe.id)}
                                                className="p-2.5 rounded-xl border border-bakery-border bg-bakery-soft/50 active:scale-95 active:bg-bakery-soft"
                                            >
                                                <Icons.Edit size={15} color="#4A3728" />
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            className="w-8 h-8 items-center justify-center rounded-full bg-bakery-soft/30"
                                            style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                                        >
                                            <Icons.ChevronDown size={16} color="#4A3728" />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {isExpanded && (
                                <View className="px-5 pb-5 pt-4 border-t border-bakery-border border-dashed gap-5">
                                    <View className="bg-bakery-soft rounded-2xl p-5 gap-3 border border-bakery-border">
                                        <Typography variant="micro" className="opacity-60 block mb-1">مواد اولیه:</Typography>
                                        <View className="gap-2">
                                            {recipe.ingredients.map((ri, i) => {
                                                const ing = ingredients.find(ingr => ingr.id === ri.ingredientId);
                                                return (
                                                    <View key={i} className="flex-row justify-between items-center">
                                                        <Typography variant="caption" className="font-bold opacity-90">{ing?.name || 'ماده نامعلوم'}</Typography>
                                                        <Typography variant="caption" className="opacity-60">{ri.quantity} {units.find(u => u.id === ing?.unitId)?.name || ''}</Typography>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    <View className="gap-3 px-1">
                                        <View className="flex-row justify-between items-center opacity-80 uppercase">
                                            <Typography variant="micro" className="opacity-60">وزن تولید:</Typography>
                                            <Typography variant="caption" className="font-bold">{recipe.outputCount} {units.find(u => u.id === recipe.outputUnitId)?.name || '-'}</Typography>
                                        </View>
                                        <View className="flex-row justify-between items-center opacity-80 uppercase">
                                            <Typography variant="micro" className="opacity-60">هزینه مواد اولیه:</Typography>
                                            <Typography variant="caption" className="font-bold">{formatPrice(recipe.ingredientsCost || 0)} تومان</Typography>
                                        </View>
                                        <View className="flex-row justify-between items-center opacity-80 uppercase">
                                            <Typography variant="micro" className="opacity-60">هزینه های مازاد بر تولید:</Typography>
                                            <Typography variant="caption" className="font-bold">{formatPrice(recipe.overheadCost || 0)} تومان</Typography>
                                        </View>
                                        <View className="flex-row justify-between items-center opacity-80 uppercase border-t border-dashed border-bakery-border pt-2.5 my-0.5">
                                            <Typography variant="micro" className="opacity-70 font-bold">هزینه کل تولید:</Typography>
                                            <Typography variant="caption" className="font-black">{formatPrice(recipe.totalCost || 0)} تومان</Typography>
                                        </View>
                                        <View className="flex-row justify-between items-center uppercase">
                                            <Typography variant="micro" className="opacity-60 text-bakery-accent">سود خالص کل:</Typography>
                                            <Typography variant="caption" className="font-black text-bakery-accent">{formatPrice(recipe.profit || 0)} تومان</Typography>
                                        </View>
                                        <View className="flex-row justify-between items-center opacity-80 uppercase">
                                            <Typography variant="micro" className="opacity-60">درصد سود:</Typography>
                                            <Typography variant="caption" className="font-bold">{recipe.profitMargin}٪</Typography>
                                        </View>
                                    </View>
                                    <Button
                                        variant="secondary"
                                        onPress={() => onHistory(recipe.id)}
                                        className="w-full flex-row items-center justify-center gap-2 py-3.5 rounded-2xl"
                                        icon={<Icons.ExternalLink size={16} color="#4A3728" />}
                                        label="مشاهده تاریخچه قیمت"
                                    />
                                </View>
                            )}
                        </Card>
                    );
                }}
                ListEmptyComponent={
                    recipes.length === 0 ? (
                        <EmptyState
                            title="هنوز دستور پختی ثبت نشده"
                            description="پس از ثبت مواد اولیه، می‌توانید دستور پخت خود را اضافه کنید تا قیمت تمام شده و سود آن محاسبه شود."
                            icon="ChefHat"
                            actionLabel="ثبت اولین دستور پخت"
                            onAction={onAdd}
                        />
                    ) : (
                        <EmptyState
                            title="نتیجه‌ای یافت نشد"
                            description="دستور پختی با نام یا مواد اولیه جستجو شده پیدا نشد."
                            icon="Search"
                            actionLabel="پاک کردن فیلتر"
                            onAction={() => setSearchQuery('')}
                            className={isKeyboardVisible ? "justify-start pt-12" : "justify-center"}
                        />
                    )
                }
                contentContainerStyle={{ paddingBottom: 100, flexGrow: filteredRecipes.length === 0 ? 1 : undefined }}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            />

            <ConfirmModal
                visible={!!idToDelete}
                onCancel={() => setIdToDelete(null)}
                onConfirm={async () => {
                    if (idToDelete) {
                        await deleteRecipe(idToDelete);
                        setIdToDelete(null);
                    }
                }}
                title="حذف دستور پخت"
                description="آیا از حذف این دستور پخت مطمئن هستید؟ تمام تاریخچه قیمت‌های مرتبط نیز حذف خواهد شد."
                confirmLabel="بله، حذف شود"
                variant="danger"
            />
        </Screen>
    );
};
