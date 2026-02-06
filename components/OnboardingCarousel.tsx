import { View, Text, Pressable, Dimensions, FlatList, Image } from 'react-native';
import { useRef, useState, type ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import logo from '../assets/Habitly_No_BG.png';

const { width } = Dimensions.get('window');

function CheckGrowthIcon() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100" fill="none">
      {/* Upward arrow base */}
      <Path
        d="M20 75 L40 50 L55 60 L80 25"
        stroke="white"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow head */}
      <Path
        d="M68 25 L80 25 L80 37"
        stroke="white"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Checkmark */}
      <Path
        d="M30 82 L42 94 L70 66"
        stroke="#86EFAC"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ProgressChartIcon() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100" fill="none">
      {/* Bar chart bars */}
      <Rect x={12} y={65} width={14} height={25} rx={4} fill="rgba(255,255,255,0.4)" />
      <Rect x={32} y={50} width={14} height={40} rx={4} fill="rgba(255,255,255,0.6)" />
      <Rect x={52} y={35} width={14} height={55} rx={4} fill="rgba(255,255,255,0.8)" />
      <Rect x={72} y={18} width={14} height={72} rx={4} fill="white" />
      {/* Growth line */}
      <Polyline
        points="19,60 39,45 59,30 79,13"
        stroke="#86EFAC"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots on line */}
      <Circle cx={19} cy={60} r={4} fill="#86EFAC" />
      <Circle cx={39} cy={45} r={4} fill="#86EFAC" />
      <Circle cx={59} cy={30} r={4} fill="#86EFAC" />
      <Circle cx={79} cy={13} r={4} fill="#86EFAC" />
    </Svg>
  );
}

type Slide = {
  key: string;
  title: string;
  description: string;
  gradientColors: [string, string];
  icon: ReactNode;
};

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    title: 'Welcome to Habitly',
    description: 'Build habits that last.\nSmall actions, done consistently.',
    gradientColors: ['#0D4F4F', '#134E5E'],
    icon: (
      <Image
        source={logo}
        resizeMode="contain"
        style={{ width: 140, height: 140, borderRadius: 24 }}
      />
    ),
  },
  {
    key: 'create',
    title: 'Create new habits',
    description: 'Every day, after performing your habit, mark it as done.',
    gradientColors: ['#134E5E', '#1A6B52'],
    icon: <CheckGrowthIcon />,
  },
  {
    key: 'track',
    title: 'Track your progress',
    description: 'Clear insights help you see how far you\u2019ve come over time.',
    gradientColors: ['#1A6B52', '#2E7D5B'],
    icon: <ProgressChartIcon />,
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
          <LinearGradient
            colors={item.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 32,
            }}>
            {/* Title */}
            <Text className="mb-6 text-3xl font-bold text-white">{item.title}</Text>

            {/* Icon container */}
            <View className="mb-8 h-44 w-44 items-center justify-center rounded-full bg-white/15">
              {item.icon}
            </View>

            {/* Description */}
            <Text className="text-center text-base leading-6 text-white/90">
              {item.description}
            </Text>
          </LinearGradient>
        )}
      />

      {/* Bottom controls */}
      <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-between px-10">
        {/* Back */}
        <Pressable
          onPress={goBack}
          disabled={index === 0}
          style={{ opacity: index === 0 ? 0.3 : 1 }}>
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5" stroke="white" strokeWidth={2} strokeLinecap="round" />
            <Path
              d="M12 19l-7-7 7-7"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>

        {/* Dots */}
        <View className="flex-row" style={{ gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                height: 8,
                width: i === index ? 24 : 8,
                borderRadius: 4,
                backgroundColor: i === index ? '#ffffff' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </View>

        {/* Next / Done */}
        <Pressable onPress={goNext}>
          {index === SLIDES.length - 1 ? (
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13l4 4L19 7"
                stroke="#86EFAC"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M5 12h14" stroke="white" strokeWidth={2} strokeLinecap="round" />
              <Path
                d="M12 5l7 7-7 7"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </Pressable>
      </View>
    </View>
  );
}
