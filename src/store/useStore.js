import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fitness_app_data';

const DEFAULT_PROFILE = {
  name: 'Alex Johnson',
  age: 28,
  gender: 'male',
  weight: 75,
  height: 175,
  goal: 'maintain',
};

const SAMPLE_ACTIVITIES = [
  {
    id: '1',
    type: 'running',
    date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0],
    duration: 35,
    calories: 340,
    distance: 5.83,
    notes: 'Morning run',
  },
  {
    id: '2',
    type: 'cycling',
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    duration: 60,
    calories: 450,
    distance: 20,
    notes: 'Afternoon ride',
  },
  {
    id: '3',
    type: 'walking',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    duration: 45,
    calories: 175,
    distance: 3.75,
    notes: 'Evening walk',
  },
  {
    id: '4',
    type: 'swimming',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    duration: 40,
    calories: 320,
    distance: 1.33,
    notes: '',
  },
  {
    id: '5',
    type: 'running',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    duration: 30,
    calories: 292,
    distance: 5,
    notes: 'Track session',
  },
  {
    id: '6',
    type: 'yoga',
    date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
    duration: 50,
    calories: 125,
    distance: 0,
    notes: 'Morning yoga',
  },
];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {/* ignore */}
  return null;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useStore() {
  const stored = loadData();
  const [profile, setProfileState] = useState(stored?.profile || DEFAULT_PROFILE);
  const [activities, setActivitiesState] = useState(stored?.activities || SAMPLE_ACTIVITIES);

  useEffect(() => {
    saveData({ profile, activities });
  }, [profile, activities]);

  function updateProfile(updates) {
    setProfileState(prev => ({ ...prev, ...updates }));
  }

  function addActivity(activity) {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivitiesState(prev => [newActivity, ...prev]);
    return newActivity;
  }

  function deleteActivity(id) {
    setActivitiesState(prev => prev.filter(a => a.id !== id));
  }

  return { profile, updateProfile, activities, addActivity, deleteActivity };
}
