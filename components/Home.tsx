import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { useState, useMemo } from 'react';
import { useIdentities } from '../hooks/useIdentities';
import HabitRow from './HabitRow';
import { useRouter } from 'expo-router';

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const { identities } = useIdentities();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const router = useRouter();

  const today = 'Dec 21';

  // Flatten habits (ANYTIME for now)
  const habits = useMemo(
    () =>
      identities.flatMap((identity) =>
        identity.habits.map((h) => ({
          ...h,
          identityId: identity.id,
        }))
      ),
    [identities]
  );

  const completedCount = habits.filter((h) => h.checkedToday).length;

  return (
    <View className="flex-1 bg-neutral-950 px-5 pt-14">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-extrabold tracking-wide text-white">TODAY</Text>
          <Text className="text-sm text-neutral-400">{today}</Text>
        </View>

        <Pressable
          onPress={() => setShowAddMenu(true)}
          className="h-11 w-11 items-center justify-center rounded-full bg-blue-500">
          <Text className="text-2xl text-white">+</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <View className="mb-3 flex-row space-x-3">
        {[
          { id: 'all', label: 'ALL' },
          { id: 'morning', label: 'MORNING' },
          { id: 'afternoon', label: 'AFTERNOON' },
        ].map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id as any)}
            className={`rounded-full px-5 py-2 ${
              filter === f.id ? 'bg-blue-500' : 'bg-neutral-800'
            }`}>
            <Text
              className={`text-sm font-semibold ${
                filter === f.id ? 'text-white' : 'text-neutral-400'
              }`}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Today summary */}
      <Text className="mb-6 text-sm text-neutral-400">
        {habits.length} habit planned · {completedCount} completed
      </Text>

      {/* Habit list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
          ANYTIME · {habits.length}
        </Text>

        {habits.map((h) => (
          <HabitRow
            key={h.id}
            habit={h}
            onToggle={() => console.log('Hello')}
            // onToggle={(duration) =>
            //   updateHabit(h.identityId, h.id, duration)
            // }
          />
        ))}

        {/* Gentle guidance */}
        {habits.length < 2 && (
          <Text className="mt-6 text-sm text-neutral-500">
            Most people start with 2–3 small habits
          </Text>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* Add menu */}
      <Modal
        visible={showAddMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddMenu(false)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setShowAddMenu(false)} />

        <View className="rounded-t-3xl bg-neutral-900 px-6 py-6">
          <Text className="mb-4 text-center text-sm font-semibold text-neutral-400">CREATE</Text>

          <Pressable
            onPress={() => {
              setShowAddMenu(false);
              router.push('/select-identity');
            }}
            className="mb-3 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
            <Text className="mr-3 text-xl">➕</Text>
            <Text className="text-base font-semibold text-white">Add Habit</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setShowAddMenu(false);
              router.push('/add-identity');
            }}
            className="flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
            <Text className="mr-3 text-xl">👤</Text>
            <Text className="text-base font-semibold text-white">Add Identity</Text>
          </Pressable>

          <Pressable onPress={() => setShowAddMenu(false)} className="mt-4 items-center py-3">
            <Text className="text-neutral-500">Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
