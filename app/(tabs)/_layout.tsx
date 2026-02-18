import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from '../../src/components/layout/TabIcon';
import { Icons } from '../../src/components/ui/Icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        animation: 'none', // Critical: avoid fade-related flicker
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#D9C4A9', // border-bakery-border
          elevation: 0,
          height: 70 + (insets.bottom || 12),
          paddingTop: 10,
          paddingBottom: insets.bottom,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -10,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'داشبورد',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Icons.Home} label="داشبورد" />
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: 'مواد اولیه',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Icons.Package} label="مواد اولیه" />
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'دستور پخت',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Icons.ChefHat} label="دستور پخت" />
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'تحلیل',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Icons.BarChart} label="تحلیل" />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'تنظیمات',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Icons.Settings} label="تنظیمات" />
        }}
      />
    </Tabs>
  );
}
