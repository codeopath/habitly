import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { useState, useMemo } from 'react';
import { useIdentities } from '../hooks/useIdentities';
import HabitRow from './HabitRow';
import { useRouter } from 'expo-router';
import { Timing } from '../model/types';

export default function Home() {
  const [filter, setFilter] = useState<Timing>(Timing.Anytime);
  const { identities } = useIdentities();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const router = useRouter();

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
  const timingOptions = Object.values(Timing);

  return (
    <View className="flex-1 bg-neutral-950 px-5 pt-14">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-extrabold tracking-wide text-white">TODAY</Text>
          <Text className="text-sm text-neutral-400">
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        <Pressable
          onPress={() => setShowAddMenu(true)}
          className="h-11 w-11 items-center justify-center rounded-full bg-blue-500">
          <Text className="text-2xl text-white">+</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <View className="mb-4 flex-row flex-wrap gap-3">
        {timingOptions.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`rounded-full px-5 py-2 ${filter === f ? 'bg-blue-500' : 'bg-neutral-800'}`}>
            <Text
              className={`text-sm font-semibold ${
                filter === f ? 'text-white' : 'text-neutral-400'
              }`}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Today summary */}
      <Text className="mb-6 text-sm text-neutral-400">
        {habits.length} habit planned · {completedCount} completed
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {identities.map((identity) => {
          const visibleHabits =
            filter === Timing.Anytime
              ? identity.habits
              : identity.habits.filter((h) => h.timing === filter);

          if (visibleHabits.length === 0) return null;

          return (
            <View key={identity.id} className="mb-8">
              {/* Identity subheading */}
              <Text className="mb-3 text-sm font-semibold text-neutral-300">
                {identity.icon ? `${identity.icon} ` : ''}
                {identity.label}
              </Text>

              {/* Habits under identity */}
              {visibleHabits.map((h) => (
                <HabitRow
                  key={h.id}
                  habit={h}
                  onToggle={() => console.log('Byeond implementation')}
                  // onToggle={(duration) =>
                  //   updateHabit(identity.id, h.id, duration)
                  // }
                />
              ))}
            </View>
          );
        })}

        {/* Gentle guidance */}
        {identities.length === 1 && identities[0].habits.length < 2 && (
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
