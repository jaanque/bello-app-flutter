import { Tabs } from 'expo-router';
import { Home } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Ocultamos las tabs ya que solo tenemos una pantalla principal
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bello',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}