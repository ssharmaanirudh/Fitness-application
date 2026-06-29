import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { calcCalories, calcDistance } from '../utils/fitness';

const DEFAULT_PROFILE = {
  name: '',
  age: 25,
  gender: 'other',
  weight: 70,
  height: 170,
  goal: 'maintain',
};

export function useStore(userId) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchAll();
  }, [userId]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [{ data: prof }, { data: acts }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('activities').select('*').eq('user_id', userId).order('date', { ascending: false }),
      ]);
      if (prof) setProfile(prof);
      if (acts) setActivities(acts);
    } catch (err) {
      console.error('fetchAll error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates) {
    const merged = { ...profile, ...updates, id: userId };
    setProfile(merged);
    await supabase.from('profiles').upsert(merged);
  }

  async function addActivity(activity) {
    const newAct = {
      ...activity,
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('activities').insert(newAct).select().single();
    if (!error && data) {
      setActivities(prev => [data, ...prev]);
      return data;
    }
  }

  async function deleteActivity(id) {
    setActivities(prev => prev.filter(a => a.id !== id));
    await supabase.from('activities').delete().eq('id', id).eq('user_id', userId);
  }

  return { profile, updateProfile, activities, addActivity, deleteActivity, loading, refetch: fetchAll };
}
