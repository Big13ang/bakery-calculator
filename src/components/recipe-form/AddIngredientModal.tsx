import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useApp } from '../../context/AppContext';
import { NewIngredient } from '../../types';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { Icons } from '../ui/Icons';
import { toEnglishDigits } from '../../utils';
import { IngredientFormFields } from '../ingredients/IngredientFormFields';

interface AddIngredientModalProps {
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: (newIngredientId: string) => void;
}

export const AddIngredientModal = ({
    visible,
    onClose,
    onSaveSuccess,
}: AddIngredientModalProps) => {
    const { addIngredient, units, ingredients, showToast } = useApp();
    const [name, setName] = useState('');
    const [unitId, setUnitId] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (visible) {
            setName('');
            setUnitId('');
            setPrice('');
        }
    }, [visible]);

    const handleSave = async () => {
        if (!name.trim() || !price || !unitId) return;

        const trimmedName = name.trim();
        const isDuplicate = ingredients.some(
            ing => ing.name.trim().toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            showToast('ماده اولیه‌ای با این نام قبلاً ثبت شده است.', 'error');
            return;
        }

        const cleanPrice = parseFloat(toEnglishDigits(price)) || 0;
        try {
            const newIng = await addIngredient({
                name: trimmedName,
                unitId,
                price: cleanPrice,
            } as NewIngredient);
            
            showToast(`ماده اولیه "${trimmedName}" با موفقیت ثبت شد.`, 'success');
            onSaveSuccess(newIng.id);
            onClose();
        } catch {
            showToast('خطایی در ثبت ماده اولیه رخ داد.', 'error');
        }
    };

    const isSubmitDisabled = !name.trim() || !price || !unitId;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <TouchableWithoutFeedback 
                    onPress={() => {
                        Keyboard.dismiss();
                        onClose();
                    }}
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <TouchableWithoutFeedback>
                            <View className="bg-bakery-card w-full rounded-t-[32px] p-6 pb-10 border-t border-bakery-border shadow-2xl">
                                {/* Drag Handle Indicator */}
                                <View className="w-12 h-1 bg-stone-300 dark:bg-stone-700 rounded-full self-center mb-6" />

                                {/* Modal Header */}
                                <View className="flex-row justify-between items-center mb-6">
                                    <Typography variant="h3" className="text-bakery-text">
                                        ثبت ماده اولیه جدید
                                    </Typography>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            onClose();
                                        }} 
                                        className="p-2 bg-bakery-soft rounded-full"
                                    >
                                        <Icons.X size={18} color="#4A3728" />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView 
                                    className="max-h-[350px] mb-10" 
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <IngredientFormFields
                                        name={name}
                                        onChangeName={setName}
                                        unitId={unitId}
                                        onChangeUnitId={setUnitId}
                                        price={price}
                                        onChangePrice={setPrice}
                                        units={units}
                                    />
                                </ScrollView>

                                {/* Action Buttons */}
                                <View className="flex-row gap-3">
                                    <Button
                                        variant="primary"
                                        label="ذخیره ماده اولیه"
                                        onPress={handleSave}
                                        disabled={isSubmitDisabled}
                                        style={{ flex: 1 }}
                                        className={`w-full h-14 ${isSubmitDisabled ? 'opacity-50' : ''}`}
                                    />
                                    <Button
                                        variant="secondary"
                                        label="انصراف"
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            onClose();
                                        }}
                                        style={{ flex: 1 }}
                                        className="w-full h-14"
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};
