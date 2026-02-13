import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { ChefHat, Droplets, Utensils, Zap } from 'lucide-react-native';

export default function HomeScreen() {
  const [flour, setFlour] = useState('500');
  const [hydration, setHydration] = useState('70');
  const [salt, setSalt] = useState('2');
  const [yeast, setYeast] = useState('1');

  const calculations = useMemo(() => {
    const f = parseFloat(flour) || 0;
    const h = parseFloat(hydration) || 0;
    const s = parseFloat(salt) || 0;
    const y = parseFloat(yeast) || 0;

    return {
      water: (f * h) / 100,
      salt: (f * s) / 100,
      yeast: (f * y) / 100,
      total: f + (f * h) / 100 + (f * s) / 100 + (f * y) / 100,
    };
  }, [flour, hydration, salt, yeast]);

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center mb-8">
          <ChefHat size={32} color="#f97316" />
          <Text className="text-3xl font-bold ml-3 text-orange-900">Bakery Calc</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <Text className="text-sm font-semibold text-gray-400 uppercase mb-4 tracking-wider">Inputs</Text>

          <View className="mb-4">
            <Text className="text-gray-600 mb-1 ml-1">Flour (g)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-lg font-medium"
              value={flour}
              onChangeText={setFlour}
              keyboardType="numeric"
              placeholder="500"
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-gray-600 mb-1 ml-1">Hydration %</Text>
              <TextInput
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-lg font-medium"
                value={hydration}
                onChangeText={setHydration}
                keyboardType="numeric"
                placeholder="70"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 mb-1 ml-1">Salt %</Text>
              <TextInput
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-lg font-medium"
                value={salt}
                onChangeText={setSalt}
                keyboardType="numeric"
                placeholder="2"
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-gray-600 mb-1 ml-1">Yeast %</Text>
            <TextInput
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-lg font-medium"
              value={yeast}
              onChangeText={setYeast}
              keyboardType="numeric"
              placeholder="1"
            />
          </View>
        </View>

        <View className="bg-orange-600 rounded-3xl p-6 shadow-md mb-6">
          <Text className="text-sm font-semibold text-orange-200 uppercase mb-4 tracking-wider">Results</Text>

          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-orange-500/30">
            <View className="flex-row items-center">
              <Droplets size={20} color="#ffedd5" />
              <Text className="text-orange-50 text-lg ml-2">Water</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{calculations.water.toFixed(1)}g</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-orange-500/30">
            <View className="flex-row items-center">
              <Utensils size={20} color="#ffedd5" />
              <Text className="text-orange-50 text-lg ml-2">Salt</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{calculations.salt.toFixed(1)}g</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-orange-500/30">
            <View className="flex-row items-center">
              <Zap size={20} color="#ffedd5" />
              <Text className="text-orange-50 text-lg ml-2">Yeast</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{calculations.yeast.toFixed(1)}g</Text>
          </View>

          <View className="flex-row items-center justify-between pt-2">
            <Text className="text-orange-100 text-lg">Total Dough</Text>
            <Text className="text-white text-3xl font-black">{calculations.total.toFixed(0)}g</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
