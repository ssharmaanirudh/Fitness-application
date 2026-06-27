import { useState } from 'react';
import { useStore } from './store/useStore';
import Dashboard from './components/Dashboard';
import ActivityLog from './components/ActivityLog';
import BMIPage from './components/BMIPage';
import Profile from './components/Profile';
import './index.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'activities', label: 'Activities', emoji: '🏃' },
  { id: 'bmi', label: 'BMI & Health', emoji: '⚖️' },
  { id: 'profile', label: 'Profile', emoji: '👤' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { profile, updateProfile, activities, addActivity, deleteActivity } = useStore();

  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <h2>💪 FitTrack</h2>
          <span>Your fitness companion</span>
        </div>

        {NAV.map(n => (
          <div
            key={n.id}
            className={`nav-item ${page === n.id ? 'active' : ''}`}
            onClick={() => setPage(n.id)}
          >
            <span style={{ fontSize: 18 }}>{n.emoji}</span>
            {n.label}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {profile.weight}kg • {profile.height}cm
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="main">
        {page === 'dashboard' && <Dashboard activities={activities} profile={profile} />}
        {page === 'activities' && (
          <ActivityLog
            activities={activities}
            onAdd={addActivity}
            onDelete={deleteActivity}
            profile={profile}
          />
        )}
        {page === 'bmi' && <BMIPage profile={profile} onUpdateProfile={updateProfile} />}
        {page === 'profile' && <Profile profile={profile} onUpdate={updateProfile} activities={activities} />}
      </main>
    </div>
  );
}
