import { View, Text, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useState, useMemo, useEffect } from 'react';
import HabitRow from './HabitRow';
import { useRouter } from 'expo-router';
import { Timing, UserHabit } from '../model/types';
import HabitActionModal from './HabitActionModal';
import { useIdentitiesContext } from '../context/IdentitiesContext';
import { tourTargets } from './AppTour';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';

export default function Home() {
  const [filter, setFilter] = useState<Timing>(Timing.Anytime);
  const { identities, updateHabit, uncheckHabit, deleteHabit, deleteIdentity, reorderHabits } =
    useIdentitiesContext();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const router = useRouter();
  const [activeHabit, setActiveHabit] = useState<UserHabit | null>(null);
  const [activeIdentityId, setActiveIdentityId] = useState<string | null>(null);
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

  // Track whether first habit ref has been set for this render
  let firstHabitRefSet = false;

  useEffect(() => {
    return () => {
      tourTargets.addButton = null;
      tourTargets.filterPills = null;
      tourTargets.firstHabit = null;
    };
  }, []);

  const handleHabitMenu = (habit: UserHabit & { identityId: string }) => {
    Alert.alert(habit.label, undefined, [
      {
        text: 'Edit',
        onPress: () =>
          router.push(`/edit-habit?habitId=${habit.id}&identityId=${habit.identityId}`),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Delete habit?', `"${habit.label}" will be permanently removed.`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleIdentityMenu = (identity: { id: string; label: string }) => {
    Alert.alert(identity.label, undefined, [
      {
        text: 'Edit',
        onPress: () => router.push(`/edit-identity?identityId=${identity.id}`),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Delete identity?',
            `"${identity.label}" and all its habits will be permanently removed.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteIdentity(identity.id) },
            ]
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
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
          ref={(el) => { tourTargets.addButton = el as unknown as View; }}
          onPress={() => setShowAddMenu(true)}
          className="h-11 w-11 items-center justify-center rounded-full bg-blue-500">
          <Text className="text-2xl text-white">+</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <View
        ref={(el) => { tourTargets.filterPills = el; }}
        className="mb-4 flex-row flex-wrap gap-3">
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
      {habits.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="mb-2 text-5xl">🌱</Text>
          <Text className="mb-2 text-lg font-semibold text-white">No habits yet</Text>
          <Text className="mb-6 text-center text-sm text-neutral-400">
            Start building your identity by adding your first habit
          </Text>
          <Pressable
            onPress={() => router.push('/select-identity')}
            className="rounded-full bg-blue-500 px-6 py-3">
            <Text className="text-base font-semibold text-white">Add Your First Habit</Text>
          </Pressable>
        </View>
      ) : (
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
                <Pressable onLongPress={() => handleIdentityMenu(identity)}>
                  <Text className="mb-3 text-sm font-semibold text-neutral-300">
                    {identity.icon ? `${identity.icon} ` : ''}
                    {identity.label}
                  </Text>
                </Pressable>

                {/* Habits under identity */}
                <DraggableFlatList
                  data={visibleHabits}
                  keyExtractor={(h) => h.id}
                  scrollEnabled={false}
                  onDragEnd={({ data }) => {
                    if (filter === Timing.Anytime) {
                      reorderHabits(identity.id, data);
                    }
                  }}
                  renderItem={({ item: h, drag, isActive }: RenderItemParams<UserHabit>) => {
                    const isFirst = !firstHabitRefSet;
                    if (isFirst) firstHabitRefSet = true;
                    return (
                      <ScaleDecorator>
                        <HabitRow
                          ref={isFirst ? (el) => { tourTargets.firstHabit = el as unknown as View; } : undefined}
                          habit={h}
                          drag={filter === Timing.Anytime ? drag : undefined}
                          isActive={isActive}
                          onMenuPress={() => handleHabitMenu({ ...h, identityId: identity.id })}
                          onPress={() => {
                            if (h.checkedToday) {
                              Alert.alert('Undo completion?', `Uncheck "${h.label}"?`, [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Undo', style: 'destructive', onPress: () => uncheckHabit(h) },
                              ]);
                            } else {
                              setActiveHabit(h);
                              setActiveIdentityId(identity.id);
                            }
                          }}
                        />
                      </ScaleDecorator>
                    );
                  }}
                />
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
      )}

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
      {activeHabit && activeIdentityId && (
        <HabitActionModal
          habit={activeHabit}
          visible={true}
          onClose={() => {
            setActiveHabit(null);
            setActiveIdentityId(null);
          }}
          onComplete={(duration) => {
            updateHabit(activeHabit, duration);
            setActiveHabit(null);
            setActiveIdentityId(null);
          }}
        />
      )}
    </View>
  );
}
