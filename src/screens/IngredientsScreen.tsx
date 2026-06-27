import { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, TouchableOpacity, View } from 'react-native';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/EmptyState';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils';

interface IngredientsScreenProps {
    onBack: () => void;
    onAdd: () => void;
    onEdit: (id: string) => void;
}

export const IngredientsScreen = ({ onBack, onAdd, onEdit }: IngredientsScreenProps) => {
    const { ingredients, deleteIngredient, units } = useApp();
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleDelete = async (id: string) => {
        if (id) {
            await deleteIngredient(id);
            setIdToDelete(null);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 0) {
            if (!isScrolled) setIsScrolled(true);
        } else {
            if (isScrolled) setIsScrolled(false);
        }
    };

    return (
        <Screen scrollable={false}>
            <Header
                title="لیست مواد اولیه"
                onBack={onBack}
                actionButton={
                    <Button variant="primary" size="icon" onPress={onAdd} className="rounded-xl w-10 h-10 p-0 items-center justify-center shadow-md">
                        <Icons.Plus size={20} color="white" />
                    </Button>
                }
                showShadow={isScrolled}
                className="mb-0"
            />

            <ScrollView
                className="flex-1 px-4"
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
            >
                {ingredients.length === 0 ? (
                    <EmptyState
                        title="هنوز ماده اولیه‌ای ثبت نشده"
                        description="برای محاسبه قیمت تمام شده، ابتدا مواد اولیه (مانند آرد، شکر، تخم مرغ و...) را ثبت کنید."
                        icon="Package"
                        actionLabel="ثبت اولین ماده اولیه"
                        onAction={onAdd}
                    />
                ) : (
                    ingredients.map(ing => (
                        <Card key={ing.id} className="p-5 flex-row items-center justify-between mb-5">
                            <View className="flex-col flex-1 gap-1">
                                <Typography variant="body" className="font-black text-base">{ing.name}</Typography>
                                <Typography variant="micro" className="opacity-60 text-[11px] text-left">
                                    {formatPrice(ing.price)} تومان / {units.find(u => u.id === ing.unitId)?.name || '-'}
                                </Typography>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <TouchableOpacity
                                    onPress={() => onEdit(ing.id)}
                                    className="p-2.5 rounded-xl border border-bakery-border bg-bakery-soft/50 active:scale-95 active:bg-bakery-soft"
                                >
                                    <Icons.Edit size={15} color="#4A3728" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setIdToDelete(ing.id)}
                                    className="p-2.5 rounded-xl border border-bakery-border bg-bakery-soft/50 active:scale-95 active:bg-bakery-soft"
                                >
                                    <Icons.Trash size={15} color="#7C2D12" />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))
                )}
            </ScrollView>

            <ConfirmModal
                visible={!!idToDelete}
                onCancel={() => setIdToDelete(null)}
                onConfirm={() => {
                    if (idToDelete) {
                        handleDelete(idToDelete);
                    }
                }}
                title="حذف ماده اولیه"
                description="آیا از حذف این ماده اولیه مطمئن هستید؟ تمام دستور پخت‌هایی که از این ماده استفاده می‌کنند تحت تاثیر قرار خواهند گرفت."
                confirmLabel="بله، حذف شود"
                variant="danger"
            />
        </Screen>
    );
};
