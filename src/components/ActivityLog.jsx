import { useState } from 'react';
import { ACTIVITIES, calcCalories, calcDistance, formatDuration, formatDate } from '../utils/fitness';
import { getActivityEmoji } from './Dashboard';

function AddActivityModal({ onClose, onAdd, weightKg }) {
  const [type, setType] = useState('running');
  const [duration, setDuration] = useState('30');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualDistance, setManualDistance] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const dur = parseInt(duration) || 0;
    const calories = manualCalories ? parseInt(manualCalories) : calcCalories(type, dur, weightKg);
    const distance = manualDistance ? parseFloat(manualDistance) : calcDistance(type, dur);
    onAdd({ type, duration: dur, date, notes, calories, distance });
    onClose();
  }

  const estimatedCal = calcCalories(type, parseInt(duration) || 0, weightKg);
  const estimatedDist = calcDistance(type, parseInt(duration) || 0);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Log Activity</h3>
        <p className="modal-subtitle">Track your workout to stay on top of your goals.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Type</label>
            <div className="activity-type-grid">
              {Object.entries(ACTIVITIES).map(([key, act]) => (
                <button
                  key={key}
                  type="button"
                  className={`activity-type-btn ${type === key ? 'selected' : ''}`}
                  onClick={() => setType(key)}
                >
                  <span style={{ fontSize: 22 }}>{getActivityEmoji(key)}</span>
                  {act.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-input"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                min="1"
                max="480"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Calories (optional override)</label>
              <input
                type="number"
                className="form-input"
                value={manualCalories}
                onChange={e => setManualCalories(e.target.value)}
                placeholder={`Est. ${estimatedCal} kcal`}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Distance km (optional)</label>
              <input
                type="number"
                className="form-input"
                value={manualDistance}
                onChange={e => setManualDistance(e.target.value)}
                placeholder={`Est. ${estimatedDist} km`}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <input
              type="text"
              className="form-input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did it feel?"
              maxLength={100}
            />
          </div>

          <div style={{
            padding: '12px 16px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8,
            marginBottom: 4,
            fontSize: 13,
            color: 'var(--text-muted)',
          }}>
            Estimated: <strong style={{ color: 'var(--text)' }}>{estimatedCal} kcal</strong> burned,{' '}
            <strong style={{ color: 'var(--text)' }}>{estimatedDist} km</strong> covered
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Log Activity</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ActivityLog({ activities, onAdd, onDelete, profile }) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  let filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'calories') return b.calories - a.calories;
    if (sortBy === 'duration') return b.duration - a.duration;
    return 0;
  });

  const totalCal = activities.reduce((s, a) => s + a.calories, 0);
  const totalDist = activities.reduce((s, a) => s + a.distance, 0);
  const totalMin = activities.reduce((s, a) => s + a.duration, 0);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Activity Log</h1>
          <p className="page-subtitle">Track all your workouts and monitor progress.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Log Activity
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f87171' }}>{totalCal.toLocaleString()}</div>
          <div className="stat-label">Total Calories Burned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#60a5fa' }}>{totalDist.toFixed(1)}</div>
          <div className="stat-label">Total km Covered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#34d399' }}>{formatDuration(totalMin)}</div>
          <div className="stat-label">Total Active Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#a5b4fc' }}>{activities.length}</div>
          <div className="stat-label">Sessions Logged</div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >All</button>
            {Object.entries(ACTIVITIES).map(([key, act]) => (
              <button
                key={key}
                className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(key)}
              >
                {getActivityEmoji(key)} {act.label}
              </button>
            ))}
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Sort: Date</option>
            <option value="calories">Sort: Calories</option>
            <option value="duration">Sort: Duration</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center" style={{ padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏃</div>
            <p>No activities logged yet. Start your first workout!</p>
          </div>
        ) : (
          <div className="activity-list">
            {filtered.map(a => {
              const act = ACTIVITIES[a.type];
              return (
                <div key={a.id} className="activity-item">
                  <div className="activity-icon" style={{ background: act?.bgColor }}>
                    <span style={{ fontSize: 22 }}>{getActivityEmoji(a.type)}</span>
                  </div>
                  <div className="activity-details">
                    <div className="activity-name">{act?.label || a.type}</div>
                    <div className="activity-meta">
                      {formatDate(a.date)} • {formatDuration(a.duration)}
                      {a.notes ? ` • "${a.notes}"` : ''}
                    </div>
                  </div>
                  <div className="activity-stats">
                    <div className="activity-stat-item">
                      <span className="activity-stat-value" style={{ color: '#f87171' }}>{a.calories}</span>
                      <span className="activity-stat-label">kcal</span>
                    </div>
                    {a.distance > 0 && (
                      <div className="activity-stat-item">
                        <span className="activity-stat-value" style={{ color: '#60a5fa' }}>{a.distance}</span>
                        <span className="activity-stat-label">km</span>
                      </div>
                    )}
                    <div className="activity-stat-item" style={{ alignItems: 'flex-end' }}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(a.id)}
                        style={{ marginTop: 2 }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <AddActivityModal
          onClose={() => setShowModal(false)}
          onAdd={onAdd}
          weightKg={profile.weight}
        />
      )}
    </div>
  );
}
