import { ACTIVITIES, calcBMI, getBMICategory, formatDuration, formatDate } from '../utils/fitness';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function WeeklyChart({ activities }) {
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayActivities = activities.filter(a => a.date === dateStr);
    const calories = dayActivities.reduce((sum, a) => sum + a.calories, 0);
    return { day: DAYS[d.getDay()], calories, isToday: i === 6 };
  });

  const max = Math.max(...week.map(d => d.calories), 1);

  return (
    <div className="week-chart">
      {week.map((d, i) => (
        <div key={i} className="week-bar-wrapper">
          <div className="week-bar-track">
            <div
              className="week-bar-fill"
              style={{
                height: `${(d.calories / max) * 100}%`,
                background: d.isToday ? 'var(--primary)' : 'var(--surface2)',
              }}
            />
          </div>
          <span className="week-bar-day" style={{ color: d.isToday ? 'var(--primary)' : undefined }}>
            {d.day}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ activities, profile }) {
  const today = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter(a => a.date === today);
  const totalCalories = todayActivities.reduce((s, a) => s + a.calories, 0);
  const totalDistance = todayActivities.reduce((s, a) => s + a.distance, 0);
  const totalMinutes = todayActivities.reduce((s, a) => s + a.duration, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekActivities = activities.filter(a => new Date(a.date) >= weekStart);
  const weekCalories = weekActivities.reduce((s, a) => s + a.calories, 0);

  const bmi = calcBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);

  const recentActivities = activities.slice(0, 4);

  return (
    <div>
      <h1 className="page-title">Good {getGreeting()}, {profile.name.split(' ')[0]}! 👋</h1>
      <p className="page-subtitle">Here's your fitness summary for today.</p>

      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>
            🔥
          </div>
          <div className="stat-value" style={{ color: '#f87171' }}>{totalCalories}</div>
          <div className="stat-label">Calories Burned Today</div>
          <div className="stat-sub">↑ {weekCalories} this week</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>
            📍
          </div>
          <div className="stat-value" style={{ color: '#60a5fa' }}>{totalDistance.toFixed(1)}</div>
          <div className="stat-label">km Covered Today</div>
          <div className="stat-sub">↑ {weekActivities.reduce((s, a) => s + a.distance, 0).toFixed(1)} km this week</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
            ⏱️
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>{formatDuration(totalMinutes)}</div>
          <div className="stat-label">Active Today</div>
          <div className="stat-sub">{todayActivities.length} session{todayActivities.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: bmiCat.badge === 'badge-green' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)' }}>
            ⚖️
          </div>
          <div className="stat-value" style={{ color: bmiCat.color }}>{bmi}</div>
          <div className="stat-label">BMI</div>
          <div className="stat-sub" style={{ color: bmiCat.color }}>{bmiCat.label}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Weekly Calorie Burn</div>
          <WeeklyChart activities={activities} />
        </div>

        <div className="card">
          <div className="card-title">Activity Breakdown (7 days)</div>
          <div style={{ marginTop: 16 }}>
            {Object.entries(ACTIVITIES).map(([key, act]) => {
              const total = weekActivities.filter(a => a.type === key).reduce((s, a) => s + a.calories, 0);
              const pct = weekCalories > 0 ? Math.round((total / weekCalories) * 100) : 0;
              if (total === 0) return null;
              return (
                <div key={key} style={{ marginBottom: 12 }}>
                  <div className="flex justify-between" style={{ marginBottom: 4 }}>
                    <span className="text-sm">{act.label}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} kcal ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: act.color, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
            {weekCalories === 0 && (
              <p className="text-muted text-sm">No activities this week yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="card-title" style={{ margin: 0 }}>Recent Activities</div>
        </div>
        {recentActivities.length === 0 ? (
          <p className="text-muted text-sm">No activities logged yet. Head to the Activities tab to get started!</p>
        ) : (
          <div className="activity-list">
            {recentActivities.map(a => {
              const act = ACTIVITIES[a.type];
              return (
                <div key={a.id} className="activity-item">
                  <div className="activity-icon" style={{ background: act?.bgColor }}>
                    <span style={{ fontSize: 20 }}>{getActivityEmoji(a.type)}</span>
                  </div>
                  <div className="activity-details">
                    <div className="activity-name">{act?.label || a.type}</div>
                    <div className="activity-meta">{formatDate(a.date)} • {formatDuration(a.duration)}{a.notes ? ` • ${a.notes}` : ''}</div>
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export function getActivityEmoji(type) {
  const map = { walking: '🚶', running: '🏃', cycling: '🚴', swimming: '🏊', hiking: '🥾', yoga: '🧘' };
  return map[type] || '💪';
}
