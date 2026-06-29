import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CHALLENGES = [
  {
    id: 'weekly_10k',
    type: 'weekly',
    emoji: '🏃',
    title: 'Run 10km This Week',
    desc: 'Log at least 10 km of running across any number of sessions this week.',
    target: 10,
    unit: 'km',
    activityTypes: ['running'],
    metric: 'distance',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    badge: '🥇 Speed Demon',
  },
  {
    id: 'weekly_5days',
    type: 'weekly',
    emoji: '📅',
    title: 'Active 5 Days This Week',
    desc: 'Log at least one activity on 5 different days this week.',
    target: 5,
    unit: 'days',
    activityTypes: 'all',
    metric: 'days',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
    badge: '🗓️ Consistency King',
  },
  {
    id: 'weekly_2000cal',
    type: 'weekly',
    emoji: '🔥',
    title: 'Burn 2000 Calories',
    desc: 'Burn a combined total of 2000 calories from all activities this week.',
    target: 2000,
    unit: 'kcal',
    activityTypes: 'all',
    metric: 'calories',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    badge: '🔥 Calorie Crusher',
  },
  {
    id: 'weekly_cycle_50',
    type: 'weekly',
    emoji: '🚴',
    title: 'Cycle 50km This Week',
    desc: 'Cover at least 50 km on your bike across all rides this week.',
    target: 50,
    unit: 'km',
    activityTypes: ['cycling'],
    metric: 'distance',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    badge: '🚴 Road Warrior',
  },
  {
    id: 'monthly_200k',
    type: 'monthly',
    emoji: '🗺️',
    title: 'Cover 200km This Month',
    desc: 'Log a combined distance of 200 km across all activities this month.',
    target: 200,
    unit: 'km',
    activityTypes: 'all',
    metric: 'distance',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    badge: '🌍 Distance Legend',
  },
  {
    id: 'monthly_20sessions',
    type: 'monthly',
    emoji: '💪',
    title: '20 Workouts This Month',
    desc: 'Log 20 individual workout sessions this month.',
    target: 20,
    unit: 'sessions',
    activityTypes: 'all',
    metric: 'sessions',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    badge: '💪 Workout Machine',
  },
];

function calcProgress(challenge, activities) {
  const now = new Date();
  let filtered;

  if (challenge.type === 'weekly') {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    filtered = activities.filter(a => new Date(a.date) >= weekStart);
  } else {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    filtered = activities.filter(a => new Date(a.date) >= monthStart);
  }

  if (challenge.activityTypes !== 'all') {
    filtered = filtered.filter(a => challenge.activityTypes.includes(a.type));
  }

  let progress = 0;
  if (challenge.metric === 'distance') progress = filtered.reduce((s, a) => s + a.distance, 0);
  else if (challenge.metric === 'calories') progress = filtered.reduce((s, a) => s + a.calories, 0);
  else if (challenge.metric === 'sessions') progress = filtered.length;
  else if (challenge.metric === 'days') {
    progress = new Set(filtered.map(a => a.date)).size;
  }

  return Math.min(parseFloat(progress.toFixed(1)), challenge.target);
}

export default function Challenges({ activities }) {
  const [filter, setFilter] = useState('all');

  const shown = filter === 'all' ? CHALLENGES : CHALLENGES.filter(c => c.type === filter);

  return (
    <div>
      <h1 className="page-title">Challenges</h1>
      <p className="page-subtitle">Push your limits. Complete challenges and earn badges. 🏅</p>

      <div className="flex gap-2" style={{ marginBottom: 24 }}>
        {['all', 'weekly', 'monthly'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '⚡ All' : f === 'weekly' ? '📅 Weekly' : '🗓️ Monthly'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {shown.map(challenge => {
          const progress = calcProgress(challenge, activities);
          const pct = Math.min((progress / challenge.target) * 100, 100);
          const done = pct >= 100;

          return (
            <div
              key={challenge.id}
              style={{
                background: done ? 'rgba(16,185,129,0.08)' : challenge.bg,
                border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : challenge.color + '40'}`,
                borderRadius: 16,
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {done && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(16,185,129,0.2)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  borderRadius: 20, padding: '3px 10px',
                  fontSize: 11, fontWeight: 700, color: '#34d399',
                }}>✅ COMPLETED</div>
              )}

              <div style={{ fontSize: 36, marginBottom: 12 }}>{done ? '🏆' : challenge.emoji}</div>

              <div style={{ marginBottom: 4 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  color: challenge.color, letterSpacing: 0.5,
                }}>{challenge.type}</span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: -0.3 }}>
                {challenge.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                {challenge.desc}
              </p>

              {/* Progress */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: challenge.color }}>
                    {progress} / {challenge.target} {challenge.unit}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: done ? '#34d399' : 'var(--text-muted)' }}>
                    {Math.round(pct)}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: done ? '#10b981' : challenge.color,
                    borderRadius: 4,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>

              {done && (
                <div style={{
                  marginTop: 12, padding: '10px 14px',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  color: '#34d399', textAlign: 'center',
                }}>
                  🎖️ Badge Earned: {challenge.badge}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
