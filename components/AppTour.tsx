import { View, Text, Pressable, Modal } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Svg, { Rect, Defs, Mask } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPOTLIGHT_PADDING = 8;
const SPOTLIGHT_RADIUS = 16;
const TOOLTIP_MARGIN = 16;

// --- Shared ref registry ---
// Other components import this and assign refs via callback refs.
export const tourTargets: Record<string, View | null> = {};

// --- Tour step definitions ---

type TourStep = {
  key: string;
  targetKey: string;
  title: string;
  description: string;
  tooltipPosition: 'above' | 'below';
};

const TOUR_STEPS: TourStep[] = [
  {
    key: 'add-button',
    targetKey: 'addButton',
    title: 'Add Habits & Identities',
    description: 'Tap this button to create new habits or add a new identity you want to grow into.',
    tooltipPosition: 'below',
  },
  {
    key: 'filters',
    targetKey: 'filterPills',
    title: 'Filter by Time',
    description: 'Filter your habits by time of day — Morning, Afternoon, Evening, or see all at once.',
    tooltipPosition: 'below',
  },
  {
    key: 'habit-card',
    targetKey: 'firstHabit',
    title: 'Track Your Habits',
    description:
      'Tap a habit to log your completion and set duration. Long-press or tap ⋯ to edit or delete.',
    tooltipPosition: 'below',
  },
  {
    key: 'tab-bar',
    targetKey: 'tabBar',
    title: 'Navigate the App',
    description:
      'Switch between Today, Progress, History, and Profile to explore all features of the app.',
    tooltipPosition: 'above',
  },
];

// --- Spotlight dimensions ---

type SpotlightRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Measure a target element relative to the overlay's root view
function measureTargetRelative(
  targetKey: string,
  overlayRef: View
): Promise<SpotlightRect | null> {
  return new Promise((resolve) => {
    const target = tourTargets[targetKey];
    if (!target) {
      resolve(null);
      return;
    }
    // measureLayout gives position relative to the overlay ancestor
    target.measureLayout(
      overlayRef,
      (x, y, width, height) => {
        if (width === 0 && height === 0) {
          resolve(null);
        } else {
          resolve({ x, y, width, height });
        }
      },
      () => {
        // Fallback to measureInWindow if measureLayout fails (cross-tree elements)
        target.measureInWindow((wx, wy, ww, wh) => {
          overlayRef.measureInWindow((ox, oy) => {
            if (ww === 0 && wh === 0) {
              resolve(null);
            } else {
              resolve({ x: wx - ox, y: wy - oy, width: ww, height: wh });
            }
          });
        });
      }
    );
  });
}

// --- Components ---

function SpotlightOverlay({
  spotlight,
  overlayWidth,
  overlayHeight,
}: {
  spotlight: SpotlightRect;
  overlayWidth: number;
  overlayHeight: number;
}) {
  const sx = spotlight.x - SPOTLIGHT_PADDING;
  const sy = spotlight.y - SPOTLIGHT_PADDING;
  const sw = spotlight.width + SPOTLIGHT_PADDING * 2;
  const sh = spotlight.height + SPOTLIGHT_PADDING * 2;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg height={overlayHeight} width={overlayWidth}>
        <Defs>
          <Mask id="spotlight">
            <Rect x="0" y="0" width={overlayWidth} height={overlayHeight} fill="white" />
            <Rect x={sx} y={sy} width={sw} height={sh} rx={SPOTLIGHT_RADIUS} fill="black" />
          </Mask>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={overlayWidth}
          height={overlayHeight}
          fill="rgba(0,0,0,0.82)"
          mask="url(#spotlight)"
        />
      </Svg>

      {/* Spotlight border glow */}
      <View
        style={{
          position: 'absolute',
          left: sx - 2,
          top: sy - 2,
          width: sw + 4,
          height: sh + 4,
          borderRadius: SPOTLIGHT_RADIUS + 2,
          borderWidth: 2,
          borderColor: 'rgba(59,130,246,0.6)',
        }}
      />
    </View>
  );
}

function TooltipCard({
  step,
  spotlight,
  stepIndex,
  totalSteps,
  overlayWidth,
  overlayHeight,
  onNext,
  onBack,
  onSkip,
}: {
  step: TourStep;
  spotlight: SpotlightRect;
  stepIndex: number;
  totalSteps: number;
  overlayWidth: number;
  overlayHeight: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  // Position the tooltip above or below the spotlight
  let tooltipTop: number;
  if (step.tooltipPosition === 'above') {
    tooltipTop = spotlight.y - SPOTLIGHT_PADDING - TOOLTIP_MARGIN - 180;
    if (tooltipTop < 60) tooltipTop = 60;
  } else {
    tooltipTop = spotlight.y + spotlight.height + SPOTLIGHT_PADDING + TOOLTIP_MARGIN;
    if (tooltipTop + 180 > overlayHeight - 40) {
      tooltipTop = overlayHeight - 220;
    }
  }

  // Arrow positioning
  const arrowLeft = Math.min(
    Math.max(spotlight.x + spotlight.width / 2 - 10, 32),
    overlayWidth - 52
  );

  return (
    <>
      {/* Arrow */}
      {step.tooltipPosition === 'below' ? (
        <View
          style={{
            position: 'absolute',
            top: tooltipTop - 8,
            left: arrowLeft,
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderBottomWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#1C1C1E',
          }}
        />
      ) : (
        <View
          style={{
            position: 'absolute',
            top: tooltipTop + 174,
            left: arrowLeft,
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#1C1C1E',
          }}
        />
      )}

      {/* Card */}
      <View
        style={{
          position: 'absolute',
          top: tooltipTop,
          left: 20,
          right: 20,
          backgroundColor: '#1C1C1E',
          borderRadius: 20,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 12,
        }}>
        {/* Step counter */}
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: '600' }}>
          STEP {stepIndex + 1} OF {totalSteps}
        </Text>

        <Text style={{ fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 8 }}>
          {step.title}
        </Text>

        <Text style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 21, marginBottom: 20 }}>
          {step.description}
        </Text>

        {/* Navigation buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Skip */}
          <Pressable onPress={onSkip} hitSlop={12}>
            <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>Skip</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Back */}
            {!isFirst && (
              <Pressable
                onPress={onBack}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: '#2A2A2C',
                }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#D1D5DB' }}>Back</Text>
              </Pressable>
            )}

            {/* Next / Done */}
            <Pressable
              onPress={onNext}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: '#3B82F6',
              }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
                {isLast ? 'Done' : 'Next'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

// --- Main Component ---

export default function AppTour() {
  const [phase, setPhase] = useState<'idle' | 'prompt' | 'tour'>('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [activeSteps, setActiveSteps] = useState<TourStep[]>(TOUR_STEPS);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const overlayRef = useRef<View>(null);

  useEffect(() => {
    AsyncStorage.getItem('hasToured').then((value) => {
      if (value !== 'true') {
        const timer = setTimeout(() => setPhase('prompt'), 800);
        return () => clearTimeout(timer);
      }
    });
  }, []);

  // Determine which steps are available (skip if target ref missing)
  const resolveActiveSteps = useCallback(async () => {
    if (!overlayRef.current) return [];
    const available: TourStep[] = [];
    for (const step of TOUR_STEPS) {
      const rect = await measureTargetRelative(step.targetKey, overlayRef.current);
      if (rect) available.push(step);
    }
    setActiveSteps(available);
    return available;
  }, []);

  const measureCurrentStep = useCallback(
    async (index: number, steps?: TourStep[]) => {
      if (!overlayRef.current) return;
      const stepsToUse = steps || activeSteps;
      if (index < 0 || index >= stepsToUse.length) return;
      const step = stepsToUse[index];
      const rect = await measureTargetRelative(step.targetKey, overlayRef.current);
      setSpotlight(rect);
    },
    [activeSteps]
  );

  const startTour = useCallback(async () => {
    setPhase('tour');
    // Wait for overlay to mount and layout
    setTimeout(async () => {
      const steps = await resolveActiveSteps();
      if (steps.length === 0) {
        await dismiss();
        return;
      }
      setStepIndex(0);
      setTimeout(() => measureCurrentStep(0, steps), 100);
    }, 400);
  }, [resolveActiveSteps, measureCurrentStep]);

  const dismiss = async () => {
    setPhase('idle');
    setSpotlight(null);
    setStepIndex(0);
    await AsyncStorage.setItem('hasToured', 'true');
  };

  const goNext = async () => {
    if (stepIndex >= activeSteps.length - 1) {
      await dismiss();
    } else {
      const next = stepIndex + 1;
      setStepIndex(next);
      await measureCurrentStep(next);
    }
  };

  const goBack = async () => {
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      setStepIndex(prev);
      await measureCurrentStep(prev);
    }
  };

  if (phase === 'idle') return null;

  // --- Prompt Phase ---
  if (phase === 'prompt') {
    return (
      <Modal visible animationType="fade" transparent statusBarTranslucent>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.85)',
            paddingHorizontal: 32,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#171717',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                color: 'white',
                textAlign: 'center',
                marginBottom: 8,
              }}>
              Welcome to Habitly!
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: '#9CA3AF',
                textAlign: 'center',
                marginBottom: 32,
                lineHeight: 22,
              }}>
              Would you like a quick tour of the app?
            </Text>

            <Pressable
              onPress={startTour}
              style={{
                width: '100%',
                backgroundColor: '#3B82F6',
                borderRadius: 16,
                paddingVertical: 16,
                marginBottom: 12,
              }}>
              <Text
                style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'white' }}>
                Show Me Around
              </Text>
            </Pressable>

            <Pressable
              onPress={dismiss}
              style={{
                width: '100%',
                backgroundColor: '#262626',
                borderRadius: 16,
                paddingVertical: 16,
              }}>
              <Text
                style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#9CA3AF' }}>
                Skip
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  // --- Tour Phase (absolute overlay, not a Modal) ---
  const currentStep = activeSteps[stepIndex];

  return (
    <View
      ref={overlayRef}
      onLayout={(e) => {
        setOverlaySize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        });
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        elevation: 9999,
      }}
      pointerEvents="box-none">
      {spotlight && currentStep && overlaySize.width > 0 && (
        <View style={{ flex: 1 }} pointerEvents="box-none">
          <SpotlightOverlay
            spotlight={spotlight}
            overlayWidth={overlaySize.width}
            overlayHeight={overlaySize.height}
          />
          <TooltipCard
            step={currentStep}
            spotlight={spotlight}
            stepIndex={stepIndex}
            totalSteps={activeSteps.length}
            overlayWidth={overlaySize.width}
            overlayHeight={overlaySize.height}
            onNext={goNext}
            onBack={goBack}
            onSkip={dismiss}
          />
        </View>
      )}
    </View>
  );
}
