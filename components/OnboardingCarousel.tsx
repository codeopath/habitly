import { View, Text, Pressable, Dimensions, FlatList } from 'react-native';
import { useRef, useState } from 'react';

const { width } = Dimensions.get('window');

type Slide = {
  key: string;
  title: string;
  description: string;
  bg: string;
  icon: string; // emoji placeholder (replace with image later)
};

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    title: 'Welcome',
    description: 'Build habits that last. Small actions, done consistently.',
    bg: 'bg-blue-900',
    icon: '🔁',
  },
  {
    key: 'create',
    title: 'Create new habits',
    description: 'Every day, after performing your habit, mark it as done.',
    bg: 'bg-orange-400',
    icon: '✅',
  },
  {
    key: 'track',
    title: 'Track your progress',
    description: 'Clear insights help you see how far you’ve come over time.',
    bg: 'bg-purple-400',
    icon: '📈',
  },
];

export default function OnboardingCarousel({ onDone }: { onDone: () => void }) {
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const goNext = () => {
    if (index === SLIDES.length - 1) {
      onDone();
    } else {
      listRef.current?.scrollToIndex({ index: index + 1 });
    }
  };

  const goBack = () => {
    if (index > 0) {
      listRef.current?.scrollToIndex({ index: index - 1 });
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className={`flex-1 items-center justify-center px-8 ${item.bg}`}>
            {/* Title */}
            <Text className="mb-6 text-3xl font-bold text-white">{item.title}</Text>

            {/* Illustration placeholder */}
            <View className="mb-8 h-44 w-44 items-center justify-center rounded-full bg-white/20">
              <Text className="text-7xl">{item.icon}</Text>
            </View>

            {/* Description */}
            <Text className="text-center text-base text-white/90">{item.description}</Text>
          </View>
        )}
      />

      {/* Bottom controls */}
      <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-between px-10">
        {/* Back */}
        <Pressable onPress={goBack} disabled={index === 0}>
          <Text className="text-2xl text-white/90">↩</Text>
        </Pressable>

        {/* Dots */}
        <View className="flex-row space-x-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </View>

        {/* Next / Done */}
        <Pressable onPress={goNext}>
          <Text className="text-2xl text-white">{index === SLIDES.length - 1 ? '✓' : '→'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
