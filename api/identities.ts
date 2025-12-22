import { Identity } from '../model/types';

const API_BASE_URL = 'https://api.yourapp.com';

export async function fetchIdentities(): Promise<Identity[]> {
  // const res = await fetch(`${API_BASE_URL}/api/identities`);
  //
  // if (!res.ok) {
  //   throw new Error('Failed to fetch identities');
  // }
  //
  // return res.json();
  return identities;
}

const identities: Identity[] = [
  {
    id: '1',
    label: 'Fitness Enthusiast',
    icon: '💪',
    habits: [
      { id: 'sleep', label: 'Sleep over 8h', icon: '😴' },
      { id: 'meal', label: 'Have a healthy meal', icon: '🍽️' },
    ],
  },
  {
    id: '2',
    label: 'Productivity Seeker',
    icon: '🚀',
    habits: [
      { id: 'water', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'workout', label: 'Workout', icon: '🏋️' },
      { id: 'walk', label: 'Walking', icon: '🚶' },
    ],
  },
  {
    id: 'health',
    label: 'Live healthier',
    icon: '❤️',
    habits: [
      { id: 'water', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'workout', label: 'Workout', icon: '🏋️' },
      { id: 'walk', label: 'Walking', icon: '🚶' },
    ],
  },
  {
    id: 'stress',
    label: 'Relieve pressure',
    icon: '🧠',
    habits: [
      { id: 'water', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'workout', label: 'Workout', icon: '🏋️' },
      { id: 'walk', label: 'Walking', icon: '🚶' },
    ],
  },
  {
    id: 'explore',
    label: 'Try new things',
    icon: '🌱',
    habits: [
      { id: 'water', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'workout', label: 'Workout', icon: '🏋️' },
      { id: 'walk', label: 'Walking', icon: '🚶' },
    ],
  },
  {
    id: 'focus',
    label: 'Be more focused',
    icon: '🎯',
    habits: [
      { id: 'water', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'workout', label: 'Workout', icon: '🏋️' },
      { id: 'walk', label: 'Walking', icon: '🚶' },
    ],
  },
  {
    id: 'relationships',
    label: 'Better relationship',
    icon: '👥',
    habits: [
      { id: 'water', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'workout', label: 'Workout', icon: '🏋️' },
      { id: 'walk', label: 'Walking', icon: '🚶' },
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep better',
    icon: '🌙',
    habits: [
      { id: 'water', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'workout', label: 'Workout', icon: '🏋️' },
      { id: 'walk', label: 'Walking', icon: '🚶' },
    ],
  },
];
