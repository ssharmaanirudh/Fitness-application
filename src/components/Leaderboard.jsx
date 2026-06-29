import { useState } from 'react';
import { formatDuration } from '../utils/fitness';

const SAMPLE_LEADERS = [
  { name: 'Priya Sharma', avatar: 'PS', calories: 3840, distance: 52.4, minutes: 410, streak: 7, badge: '🏆' },
  { name: 'Rahul Mehta', avatar: 'RM', calories: 3210, distance: 48.1, minutes: 380, streak: 6, badge: '🥈' },
  { name: 'Anjali Singh', avatar: 'AS', calories: 2990, distance: 41.7, minutes: 350, streak: 5, badge: '🥉' },
  { name: 'Vikram Patel', avatar: 'VP', calories: 2750, distance: 38.2, minutes: 320, streak: 5, badge: null },
  { name: 'Neha Gupta', avatar: 'NG', calories: 2540, distance: 34.9, minutes: 295, streak: 4, badge: null },
  { name: 'Arjun Kapoor', avatar: 'AK', calories: 2310, distance: 31.5, minutes: 270, streak: 3, badge: null },
  { name: 'Sonia Reddy', avatar: 'SR', calories: 2100, distance: 28.8, minutes: 245, streak: 3, badge: null },
  { name: 'Karan Joshi', avatar: 'KJ', calories: 1890, distance: 25.3, minutes: 220, streak: 2, badge: null },
];

const AVATAR_COLORS = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#f43f5e)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
  'linear-gradient(135deg,#14b8a6,#10b981)',
  'linear-gradient(135deg,#f97316,#f59e0b)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
];

const TABS = [
  { id: 'calories', label: '🔥 Calories', key: 'calories', unit: 'kcal', color: '#f87171' },
  { id: 'distance', label: '📍 Distance', key: 'distance', unit: 'km', color: '#60a5fa' },
  { id: 'time', label: '⏱️ Active Time', key: 'minutes', unit: '', color: '#34d399', format: formatDuration },
];

function getMedal(rank) {
  if (rank === 1) return { emoji: '🏆', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' };
  if (rank === 2) return { emoji: '🥈', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' };
  if (rank === 3) return { emoji: '🥉', color: '#cd7f32', bg: 'rgba(205,127,50,0.15)' };
  return null;
}

export default function Leaderboard({ profile, activities }) {
  const [tab, setTab] = useState('calories');

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekActivities = activities.filter(a => new Date(a.date) >= weekStart);

  const myStats = {
    calories: weekActivities.reduce((s, a) => s + a.calories, 0),
    distance: parseFloat(weekActivities.reduce((s, a) => s + a.distance, 0).toFixed(1)),
    minutes: weekActivities.reduce((s, a) => s + a.duration, 0),
    streak: calcStreak(activities),
  };

  const me = {
    name: profile.name,
    avatar: profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    ...myStats,
    isMe: true,
  };

  const activeTab = TABS.find(t => t.id === tab);
  const combined = [...SAMPLE_LEADERS, me]
    .sort((a, b) => b[activeTab.key] - a[activeTab.key]);
  const myRank = combined.findIndex(u => u.isMe) + 1;

  const formatVal = (val) => activeTab.format ? activeTab.format(val) : activeTab.key === 'distance' ? val.toFixed(1) : val.toLocaleString();

  const maxVal = combined[0]?.[activeTab.key] || 1;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Leaderboard</h1>
          <p className="page-subtitle">Weekly top performers — keep pushing, keep inspiring! 💪🔥</p>
        </div>
      </div>

      {/* Your rank summary */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.15))',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'white',
          }}>{me.avatar}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your weekly rank</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>#{myRank}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall Rank</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#f87171' }}>{myStats.calories.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>kcal this week</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#60a5fa' }}>{myStats.distance}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>km this week</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fbbf24' }}>{myStats.streak}🔥</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>day streak</div>
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      {/* Leaderboard list */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>
          This Week's Rankings — {activeTab.label}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {combined.map((user, i) => {
            const rank = i + 1;
            const medal = getMedal(rank);
            const pct = (user[activeTab.key] / maxVal) * 100;

            return (
              <div
                key={user.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  background: user.isMe
                    ? 'rgba(99,102,241,0.1)'
                    : medal ? medal.bg : 'var(--bg)',
                  border: `1px solid ${user.isMe ? 'rgba(99,102,241,0.4)' : medal ? medal.color + '40' : 'var(--border)'}`,
                  borderRadius: 12,
                  transition: 'all 0.2s',
                }}
              >
                {/* Rank */}
                <div style={{
                  width: 32, textAlign: 'center',
                  fontSize: medal ? 22 : 14,
                  fontWeight: 700,
                  color: medal ? medal.color : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {medal ? medal.emoji : `#${rank}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: user.isMe
                    ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    : AVATAR_COLORS[i % AVATAR_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white',
                }}>{user.avatar}</div>

                {/* Name + bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: user.isMe ? 'var(--primary)' : 'var(--text)' }}>
                      {user.name} {user.isMe && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>(You)</span>}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: activeTab.color, flexShrink: 0, marginLeft: 8 }}>
                      {formatVal(user[activeTab.key])} {activeTab.unit}
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: activeTab.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational footer */}
      <div style={{
        marginTop: 24,
        padding: '20px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🏅</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
          Big congratulations to all our weekly achievers!
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
          Your hard work truly shines — keep pushing, keep improving, and keep inspiring one another. 💪🔥
          <br />Log your activities every day to climb the leaderboard!
        </div>
      </div>
    </div>
  );
}

function calcStreak(activities) {
  if (activities.length === 0) return 0;
  const dates = [...new Set(activities.map(a => a.date))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let check = today;
  for (const date of dates) {
    if (date === check) {
      streak++;
      const d = new Date(check);
      d.setDate(d.getDate() - 1);
      check = d.toISOString().split('T')[0];
    } else break;
  }
  return streak;
}
