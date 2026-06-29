import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatDuration } from '../utils/fitness';

const TABS = [
  { id: 'calories', label: '🔥 Calories', key: 'calories', unit: 'kcal', color: '#f87171' },
  { id: 'distance', label: '📍 Distance', key: 'distance', unit: 'km', color: '#60a5fa' },
  { id: 'time', label: '⏱️ Active Time', key: 'minutes', unit: '', color: '#34d399', format: formatDuration },
  { id: 'sessions', label: '💪 Sessions', key: 'sessions', unit: '', color: '#a5b4fc' },
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

function getMedal(rank) {
  if (rank === 1) return { emoji: '🥇', color: '#fbbf24' };
  if (rank === 2) return { emoji: '🥈', color: '#94a3b8' };
  if (rank === 3) return { emoji: '🥉', color: '#cd7f32' };
  return null;
}

export default function CommunityLeaderboard({ currentUserId }) {
  const [tab, setTab] = useState('calories');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
    // refresh every 60s
    const interval = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchLeaderboard() {
    setLoading(true);
    setError('');
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekStartStr = weekStart.toISOString().split('T')[0];

      // Fetch all activities from last 7 days
      const { data: acts, error: actsError } = await supabase
        .from('activities')
        .select('user_id, calories, distance, duration')
        .gte('date', weekStartStr);

      if (actsError) throw actsError;

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name');

      if (profilesError) throw profilesError;

      // Aggregate by user
      const userMap = {};
      for (const act of acts || []) {
        if (!userMap[act.user_id]) {
          userMap[act.user_id] = { calories: 0, distance: 0, minutes: 0, sessions: 0 };
        }
        userMap[act.user_id].calories += act.calories;
        userMap[act.user_id].distance += act.distance;
        userMap[act.user_id].minutes += act.duration;
        userMap[act.user_id].sessions += 1;
      }

      // Merge with profiles
      const result = (profiles || [])
        .filter(p => userMap[p.id])
        .map(p => ({
          id: p.id,
          name: p.name || 'Anonymous',
          avatar: (p.name || 'AN').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          calories: Math.round(userMap[p.id]?.calories || 0),
          distance: parseFloat((userMap[p.id]?.distance || 0).toFixed(1)),
          minutes: Math.round(userMap[p.id]?.minutes || 0),
          sessions: userMap[p.id]?.sessions || 0,
          isMe: p.id === currentUserId,
        }));

      setLeaders(result);
    } catch (err) {
      setError('Could not load leaderboard. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const activeTab = TABS.find(t => t.id === tab);
  const sorted = [...leaders].sort((a, b) => b[activeTab.key] - a[activeTab.key]);
  const myRank = sorted.findIndex(u => u.isMe) + 1;
  const me = sorted.find(u => u.isMe);
  const maxVal = sorted[0]?.[activeTab.key] || 1;

  const formatVal = (val) =>
    activeTab.format ? activeTab.format(val) :
    activeTab.key === 'distance' ? val.toFixed(1) :
    val.toLocaleString();

  return (
    <div>
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Community Leaderboard</h1>
          <p className="page-subtitle">Weekly rankings across all FitTrack members. 🏆</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchLeaderboard} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* My rank card */}
      {me && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(16,185,129,0.12))',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'white',
            }}>{me.avatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{me.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your position this week</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { val: myRank > 0 ? `#${myRank}` : '—', label: 'Your Rank', color: 'var(--primary)' },
              { val: me.calories.toLocaleString(), label: 'kcal burned', color: '#f87171' },
              { val: `${me.distance} km`, label: 'distance', color: '#60a5fa' },
              { val: me.sessions, label: 'sessions', color: '#a5b4fc' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>
          This Week's Rankings — {activeTab.label}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            ⏳ Loading community data...
          </div>
        )}

        {error && (
          <div style={{
            padding: '14px', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10,
            color: '#f87171', fontSize: 14,
          }}>{error}</div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌟</div>
            <p style={{ color: 'var(--text-muted)' }}>No activity logged this week yet.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Be the first on the leaderboard — log a workout!</p>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map((user, i) => {
              const rank = i + 1;
              const medal = getMedal(rank);
              const pct = (user[activeTab.key] / maxVal) * 100;

              return (
                <div key={user.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  background: user.isMe ? 'rgba(99,102,241,0.1)' : 'var(--bg)',
                  border: `1px solid ${user.isMe ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                  borderRadius: 12,
                }}>
                  <div style={{
                    width: 32, textAlign: 'center', flexShrink: 0,
                    fontSize: medal ? 22 : 14, fontWeight: 700,
                    color: medal ? medal.color : 'var(--text-muted)',
                  }}>
                    {medal ? medal.emoji : `#${rank}`}
                  </div>

                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: user.isMe
                      ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                      : AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white',
                  }}>{user.avatar}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: user.isMe ? 'var(--primary)' : 'var(--text)' }}>
                        {user.name}{user.isMe && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>(You)</span>}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: activeTab.color, flexShrink: 0, marginLeft: 8 }}>
                        {formatVal(user[activeTab.key])} {activeTab.unit}
                      </span>
                    </div>
                    <div style={{ height: 5, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: activeTab.color, borderRadius: 3,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{
        marginTop: 24, padding: '20px 24px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🏅</div>
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
          Big congratulations to all our weekly achievers!
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
          Your hard work truly shines — keep pushing, keep improving, and keep inspiring one another. 💪🔥
        </p>
      </div>
    </div>
  );
}
