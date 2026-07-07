import { Tabs } from 'expo-router'
import {
  LayoutDashboard,
  Disc3,
  Wallet,
  ListChecks,
  Plane,
} from 'lucide-react-native'
import { colors } from '@/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent300,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.ink850,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => <Disc3 color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Income',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ color, size }) => (
            <ListChecks color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="travel"
        options={{
          title: 'Travel',
          tabBarIcon: ({ color, size }) => <Plane color={color} size={size ?? 22} />,
        }}
      />
    </Tabs>
  )
}
