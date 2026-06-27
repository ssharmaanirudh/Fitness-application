import { useState } from 'react';
import { calcBMI, getBMICategory, ACTIVITIES } from '../utils/fitness';

const GOALS = {
  lose: { label: 'Lose Weight', emoji: '📉', desc: 'Reduce body fat through cardio and caloric deficit' },
  maintain: { label: 'Maintain Weight', emoji: '⚖️', desc: 'Stay fit with balanced training and nutrition' },
  gain: { label: 'Build Muscle', emoji: '💪', desc: 'Increase muscle mass with strength training' },
  endurance: { label: 'Improve Endurance', emoji: '🏃', desc: 'Train for longer distances and stamina' },
};

export default function Profile({ profile, onUpdate, activities }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });

  function handleSave() {
    onUpdate({
      ...form,
      age: parseInt(form.age),
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
    });
    setEditing(false);
  }

  function handleCancel() {
    setForm({ ...profile });
    setEditing(false);
  }

  const bmi = calcBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);
  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const totalCal = activities.reduce((s, a) => s + a.calories, 0);
  const totalDist = activities.reduce((s, a) => s + a.distance, 0);
  const totalSessions = activities.length;

  const activityCounts = Object.keys(ACTIVITIES).map(key => ({
    key,
    label: ACTIVITIES[key].label,
    count: activities.filter(a => a.type === key).length,
    color: ACTIVITIES[key].color,
  })).filter(a => a.count > 0).sort((a, b) => b.count - a.count);

  const favoriteActivity = activityCounts[0];

  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle">Manage your personal information and fitness goals.</p>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
            <div className="profile-avatar">{initials}</div>
            <div style={{ flex: 1 }}>
              {editing ? (
                <input
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}
                />
              ) : (
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{profile.name}</div>
              )}
              <span className={`badge ${bmiCat.badge}`}>{bmiCat.label}</span>
            </div>
            <button
              className={`btn btn-sm ${editing ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => editing ? handleCancel() : setEditing(true)}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <hr className="divider" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Age</label>
              {editing ? (
                <input type="number" className="form-input" value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: e.target.value }))} min="10" max="120" />
              ) : (
                <div style={{ fontWeight: 600 }}>{profile.age} years</div>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Gender</label>
              {editing ? (
                <select className="form-select" value={form.gender}
                  onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{profile.gender}</div>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Weight (kg)</label>
              {editing ? (
                <input type="number" className="form-input" value={form.weight}
                  onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} step="0.1" min="20" max="500" />
              ) : (
                <div style={{ fontWeight: 600 }}>{profile.weight} kg</div>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Height (cm)</label>
              {editing ? (
                <input type="number" className="form-input" value={form.height}
                  onChange={e => setForm(f => ({ ...f, height: e.target.value }))} step="0.5" min="50" max="300" />
              ) : (
                <div style={{ fontWeight: 600 }}>{profile.height} cm</div>
              )}
            </div>
          </div>

          {editing && (
            <div style={{ marginTop: 20 }}>
              <label className="form-label">Fitness Goal</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(GOALS).map(([key, g]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, goal: key }))}
                    style={{
                      padding: '10px 12px',
                      background: form.goal === key ? 'rgba(99,102,241,0.15)' : 'var(--bg)',
                      border: `2px solid ${form.goal === key ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: form.goal === key ? 'var(--primary)' : 'var(--text-muted)',
                      textAlign: 'left',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {g.emoji} {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {editing && (
            <button className="btn btn-primary w-full" style={{ marginTop: 20 }} onClick={handleSave}>
              Save Changes
            </button>
          )}

          {!editing && (
            <div style={{ marginTop: 20, padding: '16px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div className="text-muted text-sm" style={{ marginBottom: 8 }}>Fitness Goal</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {GOALS[profile.goal]?.emoji} {GOALS[profile.goal]?.label}
              </div>
              <div className="text-muted text-sm" style={{ marginTop: 4 }}>
                {GOALS[profile.goal]?.desc}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card mb-6" style={{ marginBottom: 24 }}>
            <div className="card-title">Body Metrics</div>
            <div style={{ marginTop: 12 }}>
              {[
                { label: 'BMI', value: bmi, unit: '', note: bmiCat.label, noteColor: bmiCat.color },
                { label: 'Weight', value: profile.weight, unit: 'kg' },
                { label: 'Height', value: profile.height, unit: 'cm' },
                {
                  label: 'Ideal Weight',
                  value: `${(18.5 * Math.pow(profile.height / 100, 2)).toFixed(0)}–${(24.9 * Math.pow(profile.height / 100, 2)).toFixed(0)}`,
                  unit: 'kg',
                  note: 'Healthy range',
                  noteColor: 'var(--secondary)',
                },
              ].map((m, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                }}>
                  <span className="text-sm text-muted">{m.label}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700 }}>{m.value} {m.unit}</span>
                    {m.note && <div style={{ fontSize: 11, color: m.noteColor || 'var(--text-muted)' }}>{m.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">All-Time Stats</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
              {[
                { label: 'Sessions', value: totalSessions, color: '#a5b4fc', emoji: '🏋️' },
                { label: 'Calories', value: totalCal.toLocaleString(), color: '#f87171', emoji: '🔥' },
                { label: 'Distance', value: `${totalDist.toFixed(1)} km`, color: '#60a5fa', emoji: '📍' },
                { label: 'Favorite', value: favoriteActivity?.label || '—', color: favoriteActivity?.color || 'var(--text-muted)', emoji: '⭐' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: 16,
                  background: 'var(--bg)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{s.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: s.color }}>{s.value}</div>
                  <div className="text-sm text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
