import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { useState } from 'react';
import { useIdentities } from '../hooks/useIdentities';
import HabitRow from './HabitRow';
import { useRouter } from 'expo-router';

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const { identities, updateHabit } = useIdentities();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-950 px-5 pt-14">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-extrabold tracking-wide text-white">TODAY</Text>
          <Text className="text-sm text-neutral-400">Dec 21</Text>
        </View>

        <Pressable
          onPress={() => setShowAddMenu(true)}
          className="h-11 w-11 items-center justify-center rounded-full bg-blue-500">
          <Text className="text-2xl text-white">+</Text>
        </Pressable>
      </View>

      {/* Week strip */}
      <View className="mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
            <View key={d} className="mr-6 items-center">
              <Text className="text-xs text-neutral-500">{d}</Text>

              <View
                className={`mt-2 h-9 w-9 items-center justify-center rounded-full ${
                  i === 0 ? 'bg-neutral-800' : ''
                }`}>
                <Text className="text-white">{21 + i}</Text>
              </View>

              {i === 0 && <View className="mt-1 h-1 w-6 rounded bg-blue-500" />}
            </View>
          ))}
        </ScrollView>
      </View>

      {/*Filters */}
      <View className="mb-6 flex-row space-x-3">
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

      {/* Habit section */}
      <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">ANYTIME</Text>

      {identities
        .map((a) => a.habits)
        .map((habitList) =>
          habitList.map((h) => <HabitRow key={h.id} habit={h} onToggle={() => updateHabit} />)
        )}

      {/*/!* Tutorial callout *!/*/}
      {/*<View className="mt-6 max-w-[85%] rounded-2xl bg-green-700 p-4">*/}
      {/*  <Text className="mb-1 text-base font-bold text-white">*/}
      {/*    Your first habit*/}
      {/*  </Text>*/}
      {/*  <Text className="text-sm text-white/90">*/}
      {/*    Your habits will be listed here and categorized by time.*/}
      {/*  </Text>*/}
      {/*</View>*/}

      {/*/!* Skip tutorial *!/*/}
      {/*<Pressable className="mt-auto mb-6 self-center rounded-full border border-white px-10 py-3">*/}
      {/*  <Text className="font-semibold text-white">*/}
      {/*    SKIP TUTORIAL*/}
      {/*  </Text>*/}
      {/*</Pressable>*/}
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
              router.replace('/add-habit');
            }}
            className="mb-3 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
            <Text className="mr-3 text-xl">➕</Text>
            <Text className="text-base font-semibold text-white">Add Habit</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setShowAddMenu(false);
              console.log('Add identity');
              // router.push('/add-identity')
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
