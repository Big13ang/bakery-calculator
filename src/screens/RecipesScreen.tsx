import { useState } from 'react';
import { Platform, TouchableOpacity, UIManager, View } from 'react-native';
import { DeleteConfirmation } from '../components/common/DeleteConfirmation';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
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
    const { recipes, setRecipes, ingredients } = useApp();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <Screen className="p-4 pt-1">
            <Header
                title="دستورات پخت"
                onBack={onBack}
                actionButton={
                    <Button variant="primary" size="icon" onPress={onAdd} className="rounded-xl w-10 h-10 p-0 items-center justify-center shadow-md">
                        <Icons.Plus size={20} color="white" />
                    </Button>
                }
                className="mb-6"
            />

            <View className="px-0 pb-32 gap-y-5">
                {recipes.map(recipe => {
                    const isExpanded = expandedId === recipe.id;
                    const history = recipe.priceHistory;
                    const latestInflation = history.length >= 2
                        ? ((history[history.length - 1].sellingPrice - history[history.length - 2].sellingPrice) / history[history.length - 2].sellingPrice) * 100
                        : 0;

                    return (
                        <Card key={recipe.id} className="p-0 overflow-hidden mb-1">
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
                                        فروش هر {recipe.outputUnit}: {formatPrice(recipe.currentPrice / recipe.outputCount)} ت
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        className="font-black text-bakery-accent uppercase">
                                        قیمت فروش کل: {formatPrice(recipe.currentPrice)} ت
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
                                                        <Typography variant="caption" className="opacity-60">{ri.quantity} {ing?.unit || ''}</Typography>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    <View className="gap-3 px-1">
                                        <View className="flex-row justify-between items-center opacity-80 uppercase">
                                            <Typography variant="micro" className="opacity-60">وزن تولید:</Typography>
                                            <Typography variant="caption" className="font-bold">{recipe.outputCount} {recipe.outputUnit}</Typography>
                                        </View>
                                        <View className="flex-row justify-between items-center opacity-80 uppercase">
                                            <Typography variant="micro" className="opacity-60">هزینه کل:</Typography>
                                            <Typography variant="caption" className="font-bold">{formatPrice(recipe.currentCost)} تومان</Typography>
                                        </View>
                                        <View className="flex-row justify-between items-center uppercase">
                                            <Typography variant="micro" className="opacity-60">قیمت تمام شده (هر {recipe.outputUnit}):</Typography>
                                            <Typography variant="caption" className="font-black">{formatPrice(recipe.currentCost / recipe.outputCount)} تومان</Typography>
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
                })}
            </View>

            <DeleteConfirmation
                visible={!!idToDelete}
                onCancel={() => setIdToDelete(null)}
                onConfirm={() => {
                    if (idToDelete) {
                        setRecipes(prev => prev.filter(r => r.id !== idToDelete));
                        setIdToDelete(null);
                    }
                }}
            />
        </Screen>
    );
};
