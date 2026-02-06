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
      { id: 'sleep-8h', label: 'Sleep over 8h', icon: '😴' },
      { id: 'healthy-meal', label: 'Have a healthy meal', icon: '🍽️' },
      { id: 'workout-30', label: '30 min workout', icon: '🏋️' },
    ],
  },
  {
    id: '2',
    label: 'Productivity Seeker',
    icon: '🚀',
    habits: [
      { id: 'plan-tomorrow', label: 'Plan tomorrow', icon: '📋' },
      { id: 'deep-work', label: 'Deep work session', icon: '🎧' },
      { id: 'review-goals', label: 'Review goals', icon: '🎯' },
    ],
  },
  {
    id: 'health',
    label: 'Live healthier',
    icon: '❤️',
    habits: [
      { id: 'water-8', label: 'Drink 8 cups of water', icon: '🥤' },
      { id: 'eat-veggies', label: 'Eat vegetables', icon: '🥗' },
      { id: 'walk-10k', label: 'Walk 10k steps', icon: '🚶' },
    ],
  },
  {
    id: 'stress',
    label: 'Relieve pressure',
    icon: '🧠',
    habits: [
      { id: 'meditate', label: 'Meditate', icon: '🧘' },
      { id: 'journal', label: 'Journal', icon: '📓' },
      { id: 'deep-breathing', label: 'Deep breathing', icon: '🌬️' },
    ],
  },
  {
    id: 'explore',
    label: 'Try new things',
    icon: '🌱',
    habits: [
      { id: 'learn-new', label: 'Learn something new', icon: '💡' },
      { id: 'read-20', label: 'Read 20 pages', icon: '📖' },
      { id: 'new-recipe', label: 'Try a new recipe', icon: '🍳' },
    ],
  },
  {
    id: 'focus',
    label: 'Be more focused',
    icon: '🎯',
    habits: [
      { id: 'no-phone', label: 'No phone first hour', icon: '📵' },
      { id: 'single-task', label: 'Single-task 2h', icon: '⏱️' },
      { id: 'digital-detox', label: 'Digital detox evening', icon: '🌅' },
    ],
  },
  {
    id: 'relationships',
    label: 'Better relationship',
    icon: '👥',
    habits: [
      { id: 'call-loved', label: 'Call a loved one', icon: '📞' },
      { id: 'active-listen', label: 'Active listening', icon: '👂' },
      { id: 'express-gratitude', label: 'Express gratitude', icon: '🙏' },
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep better',
    icon: '🌙',
    habits: [
      { id: 'no-caffeine', label: 'No caffeine after 2pm', icon: '☕' },
      { id: 'screen-off', label: 'Screen off by 9pm', icon: '📴' },
      { id: 'wind-down', label: 'Evening wind-down', icon: '🛁' },
    ],
  },
];
